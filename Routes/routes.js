// routes.js
const express = require('express');
const userController = require('../Controllers/userController');
const resetPasswordController = require('../Controllers/resetPasswordController');
const resetPasswordUpdateController = require('../Controllers/resetPasswordUpdateController');

const router = express.Router();

// User Signup Route
router.post('/signup', userController.signup);

// User Login Route
router.post('/login', userController.login);

// Send Password Reset Link Route
router.post('/sendPasswordResetLink', resetPasswordController.sendPasswordResetLink);

// New route for setting a new password and clearing reset tokens
app.post('/resetPassword/:token', resetPasswordUpdateController.setNewPassword);

module.exports = router;