//cumulativeUserIncomeController.js
const CumulativeUserIncome = require('../Models/cumulativeUserIncomeController');
const Transaction = require('../Models/transactionsModel');

exports.calculateCumulativeIncome = async (req, res) => {
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

    const income = totalIncome.length > 0 ? totalIncome[0].totalIncome : 0;

    // Update or create the cumulative income record for the user
    await CumulativeUserIncome.findOneAndUpdate(
      { userId },
      { totalIncome: income },
      { upsert: true, new: true }
    );

    const cumulativeIncomeData = await CumulativeUserIncome.findOne({ userId });

    res.status(200).json({ cumulativeIncomeData });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};