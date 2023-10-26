// controllers/cumulativeUserExpenseController.js
const CumulativeUserExpense = require('../Models/cumulativeUserExpenseModel');
const Transaction = require('../Models/transactionsModel');

exports.calculateCumulativeExpense = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Calculate the total expenses for the user
    const totalExpenses = await Transaction.aggregate([
      {
        $match: { userId, type: 'expense' },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: '$amount' },
        },
      },
    ]);

    const expenses = totalExpenses.length > 0 ? totalExpenses[0].totalExpense : 0;

    // Update or create the cumulative expense record for the user
    await CumulativeUserExpense.findOneAndUpdate(
      { userId },
      { totalExpense: expenses },
      { upsert: true, new: true }
    );

    const cumulativeExpenseData = await CumulativeUserExpense.findOne({ userId });

    res.status(200).json({ cumulativeExpenseData });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};
