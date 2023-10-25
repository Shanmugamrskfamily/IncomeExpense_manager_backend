// resetPasswordUpdateController.js
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');

exports.setNewPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;

    // Clear the resetPasswordToken and resetPasswordExpires fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Password reset and update successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};
