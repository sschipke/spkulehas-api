import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import dayjs from "dayjs";
import config from "config";
import { ENVIRONMENT } from "../utils/contstants.js";
import {
  createEmailContext,
  createHandlebarOptions
} from "./templateConfig.js";

const baseUrl = config.get("frontEndBaseUrl");
const LOGIN_URL = new URL(`${baseUrl}/login`).href;

let transporter = nodemailer.createTransport({
  pool: true,
  service: "Gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD
  }
});

const handlebarOptions = createHandlebarOptions();

// use a template file with nodemailer
transporter.use("compile", hbs(handlebarOptions));

if (ENVIRONMENT === "development") {
  import("dotenv").then((dotenv) => {
    dotenv.config();
    transporter = nodemailer.createTransport({
      pool: true,
      service: "Gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
      }
    });
    transporter.use("compile", hbs(handlebarOptions));
  });
}

const formatDate = (date) => dayjs(date).format("MM/DD/YYYY");

const sendWelcomeEmail = async (user, index) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL, // sender address
    to: user.email,
    subject: "Welcome to the SpKuLeHaS App!",
    template: "welcome",
    context: createEmailContext(
      { user, loginUrl: LOGIN_URL },
      {
        useLayout: true,
        pageTitle: "Welcome to SpKuLeHaS",
        preheader: "Your SpKuLeHaS account is ready."
      }
    )
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
    context: createEmailContext(
      { user, url, expiration },
      {
        useLayout: true,
        pageTitle: "Password Reset",
        preheader: "Reset your SpKuLeHaS password."
      }
    )
  };

  console.log(
    "Sending reset email to: ",
    user.email,
    "environemnt: ",
    ENVIRONMENT,
    mailOptions
  );
  return transporter.sendMail(mailOptions);
};

const alertUsersOfDeletion = async (members, reservation) => {
  const { start, end, title } = reservation;
  const startDate = dayjs(start).format("dddd, MMMM D, YYYY");
  const endDate = dayjs(end).format("dddd, MMMM D, YYYY");
  const url = `${baseUrl}?date=${dayjs(start).toISOString()}`;
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: members,
    subject: "Reservation Canceled",
    template: "reservation-deleted",
    context: createEmailContext(
      { startDate, endDate, title, url },
      {
        useLayout: true,
        pageTitle: "Reservation Canceled",
        preheader: "A SpKuLeHaS reservation has been canceled."
      }
    )
  };

  console.log("Sending deletion email: ", mailOptions);
  return transporter.sendMail(mailOptions);
};

const sendSessionDeletionEmail = async (count) => {
  const date = dayjs().calendar();
  const isSingular = count === 1;
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: "swschipke@gmail.com",
    subject: "Session Deletion from SpKuLeHaS",
    template: "session-deletion-count",
    context: createEmailContext(
      { count, isSingular, date, environment: ENVIRONMENT },
      {
        useLayout: true,
        pageTitle: "Session Deletion",
        preheader: "Expired sessions were deleted from SpKuLeHaS."
      }
    )
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
  const mailOptions = {
    from: process.env.ADMIN_EMAIL, // sender address
    to: "swschipke@gmail.com",
    subject: "ERROR: Session Deletion from SpKuLeHaS",
    template: "session-deletion-error",
    context: createEmailContext(
      {
        date,
        environment: ENVIRONMENT,
        errorMessage: error?.message || String(error)
      },
      {
        useLayout: true,
        pageTitle: "Session Deletion Error",
        preheader: "An error occurred during SpKuLeHaS session cleanup."
      }
    )
  };

  return transporter.sendMail(mailOptions);
};

const sendNewMemberEmail = async (user, createUrl, expiration) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: user.email,
    subject: `Welcome ${user.firstName}, to Schipke SpKuLeHaS!`,
    template: "new-member",
    context: createEmailContext(
      {
        user,
        loginUrl: LOGIN_URL,
        createUrl,
        expiration
      },
      {
        useLayout: true,
        pageTitle: "Welcome to SpKuLeHaS",
        preheader: "Create your password to get started with SpKuLeHaS."
      }
    )
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
    context: createEmailContext(
      { user, admin, date: new Date().toLocaleString() },
      {
        useLayout: true,
        pageTitle: "New Member Created",
        preheader: "A new SpKuLeHaS member account was created."
      }
    )
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
    context: createEmailContext(
      { oldEmail, newEmail, admin, wasAdmin },
      {
        useLayout: true,
        pageTitle: "Email Change Notice",
        preheader: "Your SpKuLeHaS account email address was updated."
      }
    )
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
    `${baseUrl}?reservationId=${newReservation.id}`
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
    context: createEmailContext(
      {
        previousMember,
        currentMember,
        oldReservation,
        newReservation,
        viewReservationUrl,
        admin
      },
      {
        useLayout: true,
        pageTitle: "Reservation Change",
        preheader: "A SpKuLeHaS reservation has been updated."
      }
    )
  };

  console.info("Notifying members of reservation change. ", mailOptions);
  return transporter.sendMail(mailOptions);
};

const notifyAdminOfReservationCreation = (currentMember, reservation) => {
  const viewReservationUrl = new URL(
    `${baseUrl}?reservationId=${reservation.id}`
  ).href;
  reservation.start = formatDate(reservation.start);
  reservation.end = formatDate(reservation.end);
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "A Reservation Has Been Created",
    template: "reservation-created",
    context: createEmailContext(
      { currentMember, reservation, viewReservationUrl },
      {
        useLayout: true,
        pageTitle: "Reservation Created",
        preheader: "A new SpKuLeHaS reservation was created."
      }
    )
  };

  console.info("Notifying admin of reservation creation. ", mailOptions);
  return transporter.sendMail(mailOptions);
};

const notifyMemberOfProfileChange = async (newProfile, admin) => {
  if (process.env.NODE_ENV !== "production") {
    newProfile.email = config.get("defaultEmail");
  }

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: newProfile.email,
    subject: `${newProfile.name}'s Profile Has Been Updated`,
    template: "profile-change-notification",
    context: createEmailContext(
      { newProfile, admin, loginUrl: LOGIN_URL },
      {
        useLayout: true,
        pageTitle: "Profile Updated",
        preheader: "Your SpKuLeHaS profile information was updated."
      }
    )
  };
  console.info("Notifying member of profile change. ", mailOptions);
  return transporter.sendMail(mailOptions);
};

const notifyMemberOfStatusChange = (oldProfile, newProfile, admin) => {
  const isShareholder = newProfile.status === "S1";
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: newProfile.email,
    subject: "Your Status Has Changed",
    template: "status-change-alert",
    context: createEmailContext(
      { oldProfile, newProfile, admin, isShareholder },
      {
        useLayout: true,
        pageTitle: "Status Change",
        preheader: "Your SpKuLeHaS member status was updated."
      }
    )
  };
  console.info("Notifying member of status change. ", mailOptions);
  return transporter.sendMail(mailOptions);
};

const notifyAdminOfDeletedReservations = (deletedReservations) => {
  const date = dayjs().calendar();
  const environment = ENVIRONMENT;
  const numberOfReservations = (deletedReservations || []).length;
  deletedReservations = (deletedReservations || []).map((reservation) => {
    reservation["start"] = formatDate(reservation["start"]);
    reservation["end"] = formatDate(reservation["end"]);
    return reservation;
  });
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "Past Reservations Have Been Deleted",
    template: "bulk-reservations-delete",
    context: createEmailContext(
      { deletedReservations, numberOfReservations, date, environment },
      {
        useLayout: true,
        pageTitle: "Bulk Reservation Deletion",
        preheader: "Past SpKuLeHaS reservations were deleted."
      }
    )
  };
  console.warn("Notifying admin of bulk reservations deleted. ", mailOptions);
  return transporter.sendMail(mailOptions);
};

export {
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
  notifyMemberOfProfileChange,
  notifyMemberOfStatusChange,
  notifyAdminOfDeletedReservations
};
