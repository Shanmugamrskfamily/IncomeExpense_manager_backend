// incomeController.js
const Transaction = require('../Models/transactionsModel');


exports.addIncome = async (req, res) => {
  try {
    const { userId, userName, title, amount, category, type, description,date } = req.body;
    // const formattedDate = moment(date).format('YYYY-MM-DD');
    const income = new Transaction({ userId, userName, title, amount,date,type, category, description });

    await income.save();

    res.status(201).json({ message: 'Income added successfully', income });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.',error });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const { userId, incomeId } = req.params;

    // Find the income data by user and income IDs
    const income = await Transaction.findOne({ userId, _id: incomeId });

    if (!income) {
      return res.status(404).json({ message: 'Income data not found' });
    }

    // Delete the income data using deleteOne
    await Transaction.deleteOne({ _id: incomeId });

    res.status(200).json({ message: 'Income data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};


exports.getIncomeTransaction = async (req, res) => {
  
  try {
    const { userId, incomeId } = req.params; // Get userId and incomeId from the route parameters

    // Assuming you have an authenticated user from the middleware, you can use the userId and incomeId to find the specific income transaction
    const incomeTransaction = await Transaction.findOne({ userId, _id: incomeId, type: 'income' });

    if (!incomeTransaction) {
      return res.status(404).json({ message: 'Income transaction not found for the user.' });
    }

    res.status(200).json({ incomeTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};

