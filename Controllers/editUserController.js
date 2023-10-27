//editUserController.js
const User = require('../Models/userModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const EMAIL = process.env.E_MAIL;
const E_PASS = process.env.E_PASS;

exports.sendOTP = async (req, res) => {
  try {
    const { userId, name, mobileNumber, avatar, password, newEmail } = req.body;

    // Generate an OTP for email verification
    const otp = crypto.randomBytes(4).toString('hex');
    // Store the OTP in the user's data
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ message: 'Invalid user.' });
    }
    user.emailVerificationToken = otp;
    await user.save();
    // Send an email with the OTP for verification
    const transporter = nodemailer.createTransport({
      service: 'Outlook',
      auth: {
        user: EMAIL,
        pass: E_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: newEmail,
      subject: 'Pettycash Manager-OTP for Profile Update',
      html: `<p>Dear <b>${user.name}</b>,</p>
      <p>Your OTP for Profile Updation: <h3><b>${otp}</b></h3></p>
      <p><b>Changes You Requested For:</b></p>
      <p><ul><li>Name: ${name}</li><li>Mobile Number: ${mobileNumber}</li><li>Avatar: ${avatar}</li><li>Password: ${password}</li><li>Email:${newEmail}</li></ul></p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent for email verification' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};

exports.editUser = async (req, res) => {
  try {
    const { userId, name, mobileNumber, avatar, password, newEmail, otp } = req.body;

    // Check if the new email is already in use
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Verify the OTP
    const user = await User.findOne({ _id: userId });
    if (!user || !user.emailVerificationToken) {
      return res.status(400).json({ message: 'Invalid user or token.' });
    }

    if (user.emailVerificationToken !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Update user information
    user.name = name;
    user.mobileNumber = mobileNumber;
    user.avatar = avatar;
    user.email = newEmail;

    // If a new password is provided, hash and update it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Clear the email verification token
    user.emailVerificationToken = undefined;

    await user.save();

    res.status(200).json({ message: 'User information updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};