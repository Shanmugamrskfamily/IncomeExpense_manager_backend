// resetPasswordUpdateController.js
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config(); 

const EMAIL = process.env.E_MAIL;
const E_PASS = process.env.E_PASS;

exports.setNewPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
console.log(hashedPassword);
    // Update the user's password
    user.password = hashedPassword;

    // Clear the resetPasswordToken and resetPasswordExpires fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Save the updated user document
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
      subject: 'Pettycash Manager - Password Change Confirmation',
      html: `
      <h4>Your Password Changed</h4>
      <p>As per your request Your <b>Password</b> has been changed successfully!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset and update successful, Confirmation email sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};
