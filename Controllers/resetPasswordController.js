//resetPasswordController.js
const User = require('../Models/userModel');
const nodemailer = require('nodemailer');
const moment = require('moment');
const crypto = require('crypto');
require('dotenv').config(); 

const EMAIL = process.env.E_MAIL;
const E_PASS = process.env.E_PASS;


exports.sendPasswordResetLink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const otp = crypto.randomBytes(4).toString('hex');
    user.emailVerificationToken = otp;
    
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Outlook',
      auth: {
        user: EMAIL,
        pass: E_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL, 
      to: user.email,
      subject: 'Income&Expense Manager-Password Reset OTP',
      html: `
      <h4>Hello ${user.name},</h4>
        <p> Below is Your OTP To reset your password for your Account 👇🏻:</p>
        <b>${otp}</b>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email.',otp });
  } 
  catch (error) 
  {
    res.status(500).json({ message: 'Something went wrong.',error: error.message });
  }
};