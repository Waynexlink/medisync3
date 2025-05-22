// src/config/mail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "sandbox.smtp.mailtrap.io",
  port: process.env.MAIL_PORT || 2525,
  auth: {
    user: process.env.MAIL_USER || "YOUR_MAILTRAP_USERNAME",
    pass: process.env.MAIL_PASS || "YOUR_MAILTRAP_PASSWORD",
  },
});

module.exports = transporter;
