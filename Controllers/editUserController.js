//editUserController.js
const User = require('../Models/userModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const EMAIL = process.env.E_MAIL;
const E_PASS = process.env.E_PASS;

exports.sendOTP = async (req, res) => {
  try {
    const {userId}=req.params;
    const {  name, mobileNumber, avatar, newEmail } = req.body;

    // Generate an OTP for email verification
    const otp = crypto.randomBytes(4).toString('hex');
    // Store the OTP in the user's data
    const user = await User.findOne({ _id: userId });
    // console.log(user);
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
      subject: 'RSK Pettycash Manager-OTP for Profile Update',
      html: `<p>Dear <b>${user.name}</b>,</p>
      <p>Your OTP for Profile Updation: <h3><b>${otp}</b></h3></p>
      <p><b>Changes You Requested For:</b></p>
      <p><ul><li>Name: ${name}</li><li>Mobile Number: ${mobileNumber}</li><li>Avatar: ${avatar}</li><li>Email:${newEmail}</li></ul></p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent for email verification' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
    console.log(error);
  }
};

exports.editUser = async (req, res) => {
  try {
    const { userId, newName, newMobileNumber, newAvatar,newEmail, otp } = req.body;


    // Verify the OTP
    const user = await User.findOne({ _id: userId });
    if (!user || !user.emailVerificationToken) {
      return res.status(400).json({ message: 'Invalid user or token.' });
    }

    if (user.emailVerificationToken !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Update user information
    user.name = newName;
    user.mobileNumber = newMobileNumber;
    user.avatar = newAvatar;
    user.email = newEmail;

    // Clear the email verification token
    user.emailVerificationToken = undefined;

    await user.save();
    //sending Profile update Confirmation Email
    const transporterEmail = nodemailer.createTransport({
      service: 'Outlook',
      auth: {
        user: EMAIL,
        pass: E_PASS,
      },
    });

    const mailOptionsConfirm = {
      from: EMAIL,
      to: newEmail,
      subject: 'RSK Pettycash Manager-Profile Updated',
      html: `<p>Dear <b>${user.name}</b>,</p>
      <p>As per your Request we updated your Profile Details as follows,</p>
      <p><b>Changes you Made:</b></p>
      <p><ul><li>Name: ${user.name}</li><li>Mobile Number: ${user.mobileNumber}</li><li>Avatar: ${user.avatar}</li><li>Email:${user.email}</li></ul></p>`,
    };

    await transporterEmail.sendMail(mailOptionsConfirm);

    res.status(200).json({ message: 'User information updated successfully, Confirmation Email Sent' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};