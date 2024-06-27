const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service
  auth: {
    user: 'havocprem123@gmail.com', // Your email
    pass: 'smfw cbwf aqsf aomm', // Your email password or app-specific password
  },
});
async function sendResetEmail(email, token) {
  const resetUrl = `http://127.0.0.1:5500/frontend/password-reset.html?token=${token}`; // Adjust to match your frontend URL
  const mailOptions = {
    to: email,
    from: process.env.EMAIL,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n\n
           ${resetUrl}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };
  
  await transporter.sendMail(mailOptions);
}

const sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    from: 'havocprem123@gmail.com',
    to: email,
    subject: 'Welcome to Our App',
    text: `Hello ${username},\n\nWelcome to DREAMXCAREER! We are glad to have you.\n\nBest regards,\nYour App Team`,
  };
  await transporter.sendMail(mailOptions);
};

const sendLoginEmail = async (email, username) => {
  const mailOptions = {
    from: 'havocprem123@gmail.com',
    to: email,
    subject: 'Login Notification',
    text: `Hello ${username},\n\nYou have successfully logged in to your account.\n\nBest regards,\nDreamxcareer`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail, sendWelcomeEmail, sendLoginEmail };
