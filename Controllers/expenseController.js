// expenseController.js
const Transaction = require('../Models/transactionsModel');
const moment = require('moment');

exports.addExpense = async (req, res) => {
  try {
    const { userId, userName, title, amount, category,type, description, date } = req.body;
    // Assuming date is in 'DD-MM-YYYY' format, parse and format it to 'YYYY-MM-DD'
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const expense = new Transaction({ userId, userName, title,type, amount, date: formattedDate, category, description });

    await expense.save();

    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};
exports.deleteExpense = async (req, res) => {
  try {
    const { userId, expenseId } = req.params;

    // Find the expense data by user and expense IDs
    const expense = await Transaction.findOne({ userId, _id: expenseId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense data not found' });
    }

    // Delete the expense data using deleteOne
    await Transaction.deleteOne({ _id: expenseId });

    res.status(200).json({ message: 'Expense data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};
exports.getExpenseTransaction = async (req, res) => {
  try {
    const { userId, expenseId } = req.params; 

    
    const expenseTransaction = await Transaction.findOne({ userId, _id: expenseId, type: 'expense' });

    if (!expenseTransaction) {
      return res.status(404).json({ message: 'Expense transaction not found for the user.' });
    }

    res.status(200).json({ expenseTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};