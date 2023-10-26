// userModel.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  password: { type: String, required: true },
  resetPasswordToken: String,
resetPasswordExpires: Date,
});
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    return resetToken;
  };

module.exports = mongoose.model('User', userSchema);
