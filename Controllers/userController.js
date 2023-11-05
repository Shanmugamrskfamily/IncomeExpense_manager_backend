//userController.js
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
    const emailVerificationToken = crypto.randomBytes(4).toString('hex');

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
    const verificationOtp = emailVerificationToken;

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
      subject: 'Income&Expense Manager-Signup Email Verification OTP',
      html: `
        <h2>Income&Expense Manager</h2>
        <h4><b>Dear ${user.name},</b></h4>
        <p>Welcome to our family 😍,</p>
        <p>Your Email Verification OTP is: <b>${verificationOtp}</b></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "User registered successfully. Please verify your email.", emailVerificationToken, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    // Find the user by the provided email verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerified: false, // Check if the email is not verified yet
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.', });
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
      subject: `Income&Expense Manager - Email Verified`,
      html: `
        <h2>Income&Expense Manager</h2>
        <h4>Dear <b>${user.name},</b></h4>
        <p>Your email has been successfully verified ✅.</p>
      `,
    };

    await transporterVerified.sendMail(mailOptionsVerified);

    res.status(200).json({ message: 'Email verification successful. Confirmation Mail Sent!' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};


exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by their user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user information
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};