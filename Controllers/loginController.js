// loginController.js
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env

const SECRET_KEY = process.env.SECRET_KEY;

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if the user with the provided email exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      
      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      // Create a JWT token
      const token = jwt.sign({ userId: user._id }, SECRET_KEY);
      const userName= jwt.sign({userName:user.name});
      res.status(200).json({ message:"User Successfully Authenticated!", token, userId: user._id, userName });
    } catch (error) {
      res.status(500).json({ message: `Authentication failed. ${error.message}` });
    }
  };
  