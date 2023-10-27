// loginController.js
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    // Check if the user's email is verified
    if (!user.emailVerified) {
      return res.status(401).json({ message: 'Authentication failed. Email not verified.' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY);
    user.jwtToken=token;
    await user.save();
    const userName = user.name;
    res.status(200).json({ message: 'User Successfully Authenticated!', token, userId: user._id, userName });
  } catch (error) {
    res.status(500).json({ message: `Authentication failed. ${error.message}` });
  }
};