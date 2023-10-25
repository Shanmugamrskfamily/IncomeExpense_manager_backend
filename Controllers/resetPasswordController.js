// resetPasswordController.js
const User = require('./userModel');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env

const EMAIL = process.env.E_MAIL; // Use the environment variable for email
const E_PASS = process.env.E_PASS; // Use the environment variable for email password

// Generate and send password reset link
exports.sendPasswordResetLink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const resetToken = user.createPasswordResetToken();
    
    // Save the updated user document
    await user.save();

    // Send the password reset email
    const resetLink = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'Outlook', // e.g., 'Gmail' or use a different mailer
      auth: {
        user: EMAIL, // Use the environment variable
        pass: E_PASS, // Use the environment variable
      },
    });

    const mailOptions = {
      from: EMAIL, // Use the environment variable
      to: user.email,
      subject: 'Password Reset',
      text: `To reset your password, click on the following link: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};