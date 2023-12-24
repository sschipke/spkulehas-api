require("@babel/polyfill");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const dayjs = require("dayjs");

require("dotenv").config();

const LOGIN_URL = new URL(`${process.env.FRONT_END_BASE_URL}/login`).href;

const transporter = nodemailer.createTransport({
  pool: true,
  service: "Gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD
  }
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./email/templates/"),
    defaultLayout: false
  },
  viewPath: path.resolve("./email/templates/")
};

// use a template file with nodemailer
transporter.use("compile", hbs(handlebarOptions));

const formatDate = (date) => dayjs(date).format("MM/DD/YYYY");

const sendWelcomeEmail = async (user, index) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL, // sender address
    to: user.email,
    subject: "Welcome to the SpKuLeHaS App!",
    template: "welcome",
    context: {
      user,
      loginUrl: LOGIN_URL
    }
  };

  return new Promise((resolve, reject) => {
    console.log(
      "Sending welcome email: ",
      user.email,
      user.profile.name,
      process.env.NODE_ENV || "development"
    );
    transporter.sendMail(mailOptions, async (error) => {
      if (error) {
        console.error(
          "Unable to send welcome email. ",
          error,
          user.email,
          mailOptions
        );
        reject("Could not send welcome email" + error, user.email);
      } else {
        console.log(
          "Successfully sent welcome email! Sent to: ",
          user.email,
          index
        );
        resolve(true);
      }
    });
  });
};

const sendPasswordResetEmail = async (user, url, expiration) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: user.email,
    subject: "Password Reset",
    template: "password-reset",
    context: {
      user,
      url,
      expiration
    }
  };

  console.log(
    "Sending reset email to: ",
    user.email,
    process.env.NODE_ENV,
    mailOptions
  );
  return transporter.sendMail(mailOptions);
};

const alertUsersOfDeletion = async (members, reservation) => {
  const { start, end, title } = reservation;
  const startDate = dayjs(start).format("dddd, MMMM D, YYYY");
  const endDate = dayjs(end).format("dddd, MMMM D, YYYY");
  const url = `${process.env.FRONT_END_BASE_URL}?date=${dayjs(
    start
  ).toISOString()}`;
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: members,
    subject: "Reservation Canceled",
    template: "reservation-deleted",
    context: {
      startDate,
      endDate,
      title,
      url
    }
  };

  console.log("Sending deletion email: ", mailOptions);
  return transporter.sendMail(mailOptions);
};

const sendSessionDeletionEmail = async (count) => {
  const date = dayjs().calendar();
  const environment = process.env.NODE_ENV || "development";
  const isSingular = count === 1;
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: "swschipke@gmail.com",
    subject: "Session Deletion from SpKuLeHaS",
    template: "session-deletion-count",
    context: {
      count,
      isSingular,
      date,
      environment
    }
  };

  return new Promise((resolve, reject) => {
    console.log("Sending session deletion Email.", { mailOptions });
    transporter.sendMail(mailOptions, async (error) => {
      if (error) {
        console.error(
          "Unable to send session deletion email. ",
          error,
          mailOptions
        );
        reject("Could not send session deletion welcome email. " + date);
      } else {
        console.log("Successfully sent session deletion email!");
        resolve(true);
      }
    });
  });
};

const sendSessionDeletionErrorEmail = async (error) => {
  const date = dayjs().format("dddd, MMMM DD, YYYY, h:mm a");
  const environment = process.env.NODE_ENV || "development";
  const mailOptions = {
    from: process.env.ADMIN_EMAIL, // sender address
    to: "swschipke@gmail.com",
    subject: "ERROR: Session Deletion from SpKuLeHaS",
    template: "session-deletion-count",
    context: {
      date,
      environment,
      error
    }
  };

  return transporter.sendMail(mailOptions);
};

const sendNewMemberEmail = async (user, createUrl, expiration) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: user.email,
    subject: `Welcome ${user.firstName}, to Schipke SpKuLeHaS!`,
    template: "new-member",
    context: {
      user,
      loginUrl: LOGIN_URL,
      createUrl,
      expiration
    }
  };

  console.log(
    "Sending new member email to: ",
    user.email,
    process.env.NODE_ENV,
    mailOptions
  );
  return transporter.sendMail(mailOptions);
};

const alertAdminOfMemberCreation = async (user, admin) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "A New Member Has Been Created",
    template: "new-member-alert",
    context: {
      user,
      admin,
      date: new Date().toLocaleString()
    }
  };

  console.log("Sending new member alert email.", mailOptions);
  return transporter.sendMail(mailOptions);
};

const notifyMemberOfEmailChange = async (
  oldEmail,
  newEmail,
  admin,
  didAdminChange
) => {
  const wasAdmin = didAdminChange && admin && admin.isAdmin;
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: newEmail,
    subject: "Your Email Has Changed",
    template: "email-change-alert",
    context: {
      oldEmail,
      newEmail,
      admin,
      wasAdmin
    }
  };

  console.log("Notifying member of email change: ", mailOptions);
  return transporter.sendMail(mailOptions);
};

const emailMembersOfReservationChange = async (
  previousMember,
  currentMember,
  oldReservation,
  newReservation,
  admin
) => {
  const viewReservationUrl = new URL(
    `${process.env.FRONT_END_BASE_URL}?reservationId=${newReservation.id}`
  ).href;
  oldReservation.start = formatDate(oldReservation.start);
  oldReservation.end = formatDate(oldReservation.end);
  newReservation.start = formatDate(newReservation.start);
  newReservation.end = formatDate(newReservation.end);
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: [previousMember.email, currentMember.email],
    subject: "Your Reservation Has Changed",
    template: "reservation-change",
    context: {
      previousMember,
      currentMember,
      oldReservation,
      newReservation,
      viewReservationUrl,
      admin
    }
  };

  console.info("Notifying members of reservation change. ", mailOptions);
  return transporter.sendMail(mailOptions);
};

const notifyAdminOfReservationCreation = (currentMember, reservation) => {
  const viewReservationUrl = new URL(
    `${process.env.FRONT_END_BASE_URL}?reservationId=${reservation.id}`
  ).href;
  reservation.start = formatDate(reservation.start);
  reservation.end = formatDate(reservation.end);
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "A Reservation Has Been Created",
    template: "reservation-created",
    context: {
      currentMember,
      reservation,
      viewReservationUrl
    }
  };

  console.info("Notifying admin of reservation creation. ", mailOptions);
  return transporter.sendMail(mailOptions);
};

const notifyMemberOfProfileChange = async (newProfile, admin) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: newProfile.email,
    subject: `${newProfile.name}'s Profile Has Been Updated`,
    template: "profile-change-notification",
    context: {
      newProfile,
      admin,
      loginUrl: LOGIN_URL
    }
  };
  console.info("Notifying member of profile change. ", mailOptions);
  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  alertUsersOfDeletion,
  sendSessionDeletionEmail,
  sendSessionDeletionErrorEmail,
  sendNewMemberEmail,
  alertAdminOfMemberCreation,
  notifyMemberOfEmailChange,
  emailMembersOfReservationChange,
  notifyAdminOfReservationCreation,
  notifyMemberOfProfileChange
};
