// userController.js
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, email, password } = req.body;
    
    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }
    
    const user = new User({ firstName, lastName, mobileNumber, email, password });
    await user.save();
    
    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    
    res.status(201).json({ message:"User Successfully Registered!", token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};
