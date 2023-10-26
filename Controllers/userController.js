const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const EMAIL = process.env.E_MAIL;
const E_PASS = process.env.E_PASS;

exports.signup = async (req, res) => {
  try {
    const { name, mobileNumber, email, password } = req.body;

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, mobileNumber, email, password: hashedPassword, verified: false });

    await user.save();

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY);

    // Send an email with a verification link
    const verificationToken = user.createPasswordResetToken();
    const verificationLink = `${req.protocol}://${req.get('host')}/api/verifyEmail/${verificationToken}`;
    
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
      subject: 'Email Verification',
      html: `
        <p>To verify your email, click on the following button:</p>
        <a href="${verificationLink}" style="background-color: #007BFF; color: #fff; text-decoration: none; padding: 10px 20px; display: inline-block; border-radius: 5px;">Verify Email</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "User registered successfully. Please verify your email.", token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      verified: false, // Verify that the email hasn't been verified yet
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    // Update the user's email verification status
    user.verified = true;
    await user.save();

    res.status(200).json({ message: 'Email verification successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};
