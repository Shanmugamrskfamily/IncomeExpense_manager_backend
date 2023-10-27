//expensePerUserController.js
const Transaction = require('../Models/transactionsModel');

exports.getAllExpenseTransactions = async (req, res) => {
  try {
    const userId = req.params.userId;

    const expenseTransactions = await Transaction.find({ userId, type: 'expense' }).sort({ date: -1 });

    res.status(200).json({ expenseTransactions });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};
