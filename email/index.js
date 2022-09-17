require("@babel/polyfill");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const moment = require("moment");

require("dotenv").config();

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

const sendWelcomeEmail = async (user, index) => {
  const loginUrl = `${process.env.FRONT_END_BASE_URL}login`;
  const mailOptions = {
    from: process.env.ADMIN_EMAIL, // sender address
    to: user.email,
    subject: "Welcome to the SpKuLeHaS App!",
    template: "welcome",
    context: {
      user,
      loginUrl
    }
  };

  return new Promise((resolve, reject) => {
    console.log(
      "Sending welcome email: ",
      user.email,
      user.profile.name,
      process.env.NODE_ENV || "development"
    );
    transporter.sendMail(mailOptions, async (error, info) => {
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

const sendPasswordResetEmail = async (user, url) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: user.email,
    subject: "Password Reset",
    template: "password-reset",
    context: {
      user,
      url
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
  const startDate = moment(start).format("dddd, MMMM Do, YYYY");
  const endDate = moment(end).format("dddd, MMMM Do, YYYY");
  const url = `${process.env.FRONT_END_BASE_URL}?date=${moment(
    start
  ).toISOString()}`;
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: members,
    subject: "Reservation Deleted",
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

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  alertUsersOfDeletion
};
