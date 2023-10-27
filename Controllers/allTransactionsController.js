//allTransactionsController.js
const Transaction = require('../Models/transactionsModel');

exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.params.userId;

    const allTransactions = await Transaction.find({ userId }).sort({ date: -1 });

    res.status(200).json({ allTransactions });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};
