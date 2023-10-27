const express = require('express');
const userController = require('../Controllers/userController');
const loginController = require('../Controllers/loginController');
const resetPasswordController = require('../Controllers/resetPasswordController');
const resetPasswordUpdateController = require('../Controllers/resetPasswordUpdateController');
const incomeController = require('../Controllers/incomeController');
const expenseController = require('../Controllers/expenseController');
const cashBalanceController = require('../Controllers/cashBalanceController');
const cumulativeUserIncomeController = require('../Controllers/cumulativeUserIncomeController');
const cumulativeUserExpenseController = require('../Controllers/cumulativeUserExpenseController');
const incomePerUserController = require('../Controllers/incomePerUserController');
const expensePerUserController = require('../Controllers/expensePerUserController');
const allTransactionsController = require('../Controllers/allTransactionsController');
const editExpenseController = require('../Controllers/editExpenseController');
const editIncomeController = require('../Controllers/editIncomeController');
const editUserController = require('../Controllers/editUserController');
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

// Add Income Route
router.post('/addIncome', incomeController.addIncome);

// Add Expense Route
router.post('/addExpense', expenseController.addExpense);

// Calculate cash balance for a specific user
router.get('/cashBalance/:userId', cashBalanceController.calculateCashBalance);

// Calculate cumulative income amount for a specific user
router.get('/cumulativeIncome/:userId', cumulativeUserIncomeController.calculateCumulativeIncome);

// Calculate cumulative expense amount for a specific user
router.get('/cumulativeExpense/:userId', cumulativeUserExpenseController.calculateCumulativeExpense);

// Get all income transactions for a specific user
router.get('/incomeTransactions/:userId', incomePerUserController.getAllIncomeTransactions);

// Get all expense transactions for a specific user
router.get('/expenseTransactions/:userId', expensePerUserController.getAllExpenseTransactions);

// Get all income and expense transactions for a specific user, sorted by date
router.get('/allTransactions/:userId', allTransactionsController.getAllTransactions);

// Edit an expense transaction for a specific user
router.put('/editExpense/:userId/:transactionId', editExpenseController.editExpenseTransaction);

// Edit an income transaction for a specific user
router.put('/editIncome/:userId/:transactionId', editIncomeController.editIncomeTransaction);

// Send OTP for email verification
router.post('/sendOTP', editUserController.sendOTP);

// Edit user data, including email verification and OTP validation
router.put('/editUser', editUserController.editUser);

// Get user information by user ID
router.get('/user/:userId', userController.getUserInfo);

module.exports = router;