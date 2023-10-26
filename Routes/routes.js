const express = require('express');
const userController = require('../Controllers/userController');
const loginController = require('../Controllers/loginController');
const resetPasswordController = require('../Controllers/resetPasswordController');
const resetPasswordUpdateController = require('../Controllers/resetPasswordUpdateController');
const router = express.Router();

// User Signup Route
router.post('/signup', userController.signup);

// Email Verification Route
router.get('/verifyEmail/:token', userController.verifyEmail);

// User Login Route with email verification check
router.post('/login',loginController.login);

// Send Password Reset Link Route
router.post('/sendPasswordResetLink', resetPasswordController.sendPasswordResetLink);

// Route for setting a new password and clearing reset tokens
router.post('/resetPassword/:token', resetPasswordUpdateController.setNewPassword);



module.exports = router;