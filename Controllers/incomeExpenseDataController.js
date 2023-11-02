const Transaction = require('../Models/transactionsModel');
const moment = require('moment');

// Get all income and expense transactions for a specific user within a date range
exports.getAllIncomeAndExpenseData = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { startDate, endDate } = req.body; // Date range parameters
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

    // Find income and expense transactions for the user with a date within the specified range
    const incomeAndExpenseData = await Transaction.find({
      userId,
      type: { $in: ['income', 'expense'] }, // Filter by income and expense
      date: { $gte: formattedStartDate, $lte: formattedEndDate },
    }).sort({ date: 1 }); // Sort by date in descending order (newest to oldest)

    res.status(200).json({ incomeAndExpenseData });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};
