// expenseController.js
const Transaction = require('../Models/transactionsModel');
const moment = require('moment');

exports.addExpense = async (req, res) => {
  try {
    const { userId, userName, title, amount, category,type, description, date } = req.body;
    // Assuming date is in 'DD-MM-YYYY' format, parse and format it to 'YYYY-MM-DD'
    const formattedDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');

    const expense = new Transaction({ userId, userName, title,type, amount, date: formattedDate, category, description });

    await expense.save();

    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};
