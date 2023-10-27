//incomePerUserController.js
const Transaction = require('../Models/transactionsModel');

exports.getAllIncomeTransactions = async (req, res) => {
  try {
    const userId = req.params.userId;

    const incomeTransactions = await Transaction.find({ userId, type: 'income' }).sort({ date: -1 });

    res.status(200).json({ incomeTransactions });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};
