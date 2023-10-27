//Routes.js
const express = require('express');
const router = express.Router();
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

// User Routes
router.post('/signup', userController.signup);
router.get('/verifyEmail/:token', userController.verifyEmail);
router.post('/login', loginController.login);
router.post('/sendPasswordResetLink', resetPasswordController.sendPasswordResetLink);
router.post('/resetPassword/:token', resetPasswordUpdateController.setNewPassword);

// Income Routes
router.post('/addIncome', incomeController.addIncome);
router.get('/incomeTransactions/:userId', incomePerUserController.getAllIncomeTransactions);
router.put('/editIncome/:userId/:transactionId', editIncomeController.editIncomeTransaction);
router.delete('/deleteIncome/:userId/:incomeId', incomeController.deleteIncome);

// Expense Routes
router.post('/addExpense', expenseController.addExpense);
router.get('/expenseTransactions/:userId', expensePerUserController.getAllExpenseTransactions);
router.put('/editExpense/:userId/:transactionId', editExpenseController.editExpenseTransaction);
router.delete('/deleteExpense/:userId/:expenseId', expenseController.deleteExpense);

// Cash Balance and Cumulative Routes
router.get('/cashBalance/:userId', cashBalanceController.calculateCashBalance);
router.get('/cumulativeIncome/:userId', cumulativeUserIncomeController.calculateCumulativeIncome);
router.get('/cumulativeExpense/:userId', cumulativeUserExpenseController.calculateCumulativeExpense);

// Transactions Routes
router.get('/allTransactions/:userId', allTransactionsController.getAllTransactions);

// Edit User Routes
router.post('/sendOTP', editUserController.sendOTP);
router.put('/editUser', editUserController.editUser);
router.get('/user/:userId', userController.getUserInfo);

module.exports = router;