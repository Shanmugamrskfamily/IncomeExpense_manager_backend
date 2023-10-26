const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const EMAIL = process.env.E_MAIL;
const E_PASS = process.env.E_PASS;

exports.signup = async (req, res) => {
  try {
    const { name, mobileNumber, email, password, avatar } = req.body;

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate an email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      name,
      mobileNumber,
      email,
      avatar,
      password: hashedPassword,
      emailVerificationToken,
      emailVerified: false, // Mark the email as unverified
    });

    await user.save();
    // Send an email with the verification link
    const verificationLink = `${req.protocol}://${req.get('host')}/api/verifyEmail/${emailVerificationToken}`;

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
      subject: 'Pettycash Manager-Email Verification',
      html: `
        <h2>Pettycash Manager</h2>
        <h4><b>Dear ${user.name},</b></h4>
        <p>Welcome to our family 😍, To verify your email, click on the following button 👇🏻:</p>
        <a href="${verificationLink}" style="background-color: #007BFF; color: #fff; text-decoration: none; padding: 10px 20px; display: inline-block; border-radius: 5px;">Verify Email</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "User registered successfully. Please verify your email.", emailVerificationToken, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerified: false, // Verify that the email hasn't been verified yet
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    // Update the user's email verification status
    user.emailVerified = true;
    user.emailVerificationToken = undefined; // Clear the verification token
    await user.save();
    const transporterVerified = nodemailer.createTransport({
      service: 'Outlook',
      auth: {
        user: EMAIL,
        pass: E_PASS,
      },
    });

    const mailOptionsVerified = {
      from: EMAIL,
      to: user.email,
      subject: `Pettycash Manager- Email Veified`,
      html: `
        <h2>Pettycash Manager</h2>
        <h4></h4>Dear <b>${user.name}</b>,</h4>
        <p>Your Successfully Verified ✅ Your Email 📧</p>
      `,
    };

    await transporterVerified.sendMail(mailOptionsVerified);
    res.status(200).json({ message: 'Email verification successful, Confirmation Mail Sent!' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};
