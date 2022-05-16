require("@babel/polyfill");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

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
  const mailOptions = {
    from: process.env.ADMIN_EMAIL, // sender address
    to: user.email,
    subject: "Welcome to the SpKuLeHaS App!",
    template: "welcome-email",
    context: {
      user,
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

module.exports = {
  sendWelcomeEmail,
};
