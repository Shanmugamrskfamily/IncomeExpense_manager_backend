// routes.js
const express = require('express');
const userController = require('../Controllers/userController');
const resetPasswordController = require('../Controllers/resetPasswordController');

const router = express.Router();

// User Signup Route
router.post('/signup', userController.signup);

// User Login Route
router.post('/login', userController.login);

// Send Password Reset Link Route
router.post('/sendPasswordResetLink', resetPasswordController.sendPasswordResetLink);

module.exports = router;