const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const otpSendMail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for resetting your password is ${otp}. This OTP is valid for 10 minutes.`,
  });
};

module.exports = otpSendMail;
