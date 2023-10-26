
const User = require('../Models/userModel');
const nodemailer = require('nodemailer');
const moment = require('moment');
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

    const resetToken = user.createPasswordResetToken();
    
    
    await user.save();

    
    const resetLink = `${req.protocol}://${req.get('host')}/api/resetPassword/${resetToken}`;
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
      subject: 'Password Reset',
      html: `
        <p>To reset your password, click on the following button:</p>
        <a href="${resetLink}" style="background-color: #007BFF; color: #fff; text-decoration: none; padding: 10px 20px; display: inline-block; border-radius: 5px;">Reset Password</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email.',resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};