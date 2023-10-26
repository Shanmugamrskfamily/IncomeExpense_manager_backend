// controllers/cashBalanceController.js
const CashBalance = require('../Models/cashBalanceModel');
const Transaction = require('../Models/transactionsModel');

exports.calculateCashBalance = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Calculate the total income for the user
    const totalIncome = await Transaction.aggregate([
      {
        $match: { userId, type: 'income' },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' },
        },
      },
    ]);

    // Calculate the total expenses for the user
    const totalExpenses = await Transaction.aggregate([
      {
        $match: { userId, type: 'expense' },
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' },
        },
      },
    ]);

    const income = totalIncome.length > 0 ? totalIncome[0].totalIncome : 0;
    const expenses = totalExpenses.length > 0 ? totalExpenses[0].totalExpenses : 0;

    // Calculate the cash balance
    const cashBalance = income - expenses;

    // Update or create the cash balance record for the user
    await CashBalance.findOneAndUpdate(
      { userId },
      { balance: cashBalance },
      { upsert: true, new: true }
    );

    res.status(200).json({ cashBalance });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};
