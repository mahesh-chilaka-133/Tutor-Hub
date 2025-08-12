const nodemailer = require('nodemailer');
require('dotenv').config(); // ✅ Ensure .env is loaded

const sendEmail = async (options) => {
  // Debug check — confirm environment variables are loaded
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Missing EMAIL_USER or EMAIL_PASS in environment variables.');
    throw new Error('SMTP credentials are missing.');
  }

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
    auth: {
      user: process.env.EMAIL_USER, // ✅ matches .env
      pass: process.env.EMAIL_PASS, // ✅ matches .env
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${options.email}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};

module.exports = sendEmail;
