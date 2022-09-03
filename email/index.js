require("@babel/polyfill");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const moment = require("moment");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./email/templates/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./email/templates/"),
};

// use a template file with nodemailer
transporter.use("compile", hbs(handlebarOptions));

const sendWelcomeEmail = async (user) => {
  const frontEndUrl = process.env.FRONT_END_BASE_URL;
  const mailOptions = {
    from: process.env.ADMIN_EMAIL, // sender address
    to: user.email,
    subject: "Welcome to the SpKuLeHaS App!",
    template: "welcome",
    context: {
      user,
      frontEndUrl,
    },
  };

  console.log(
    "Sending email: ",
    user.email,
    user.profile.name,
    process.env.NODE_ENV,
    mailOptions
  );
  return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (user, url) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: user.email,
    subject: "Password Reset",
    template: "password-reset",
    context: {
      user,
      url,
    },
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
      url,
    },
  };

  console.log("Sending deletion email: ", mailOptions);
  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  alertUsersOfDeletion,
};
