//editExpenseController.js
const Transaction = require('../Models/transactionsModel');
const moment = require('moment'); // Import the moment library

exports.editExpenseTransaction = async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactionId = req.params.transactionId;
    const { title, amount, category, description, date, type } = req.body;

    // Format the date using moment to "DD-MM-YYYY"
    const formattedDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');

    // Find the transaction to be edited
    const transaction = await Transaction.findOne({ _id: transactionId, userId, type: 'expense' });

    if (!transaction) {
      return res.status(404).json({ message: 'Expense transaction not found for the user.' });
    }

    // Update the transaction data
    transaction.title = title;
    transaction.amount = amount;
    transaction.category = category;
    transaction.description = description;
    transaction.date = formattedDate; 
    transaction.type= type;
    // Save the updated transaction
    await transaction.save();

    res.status(200).json({ message: 'Expense transaction updated successfully', updatedTransaction: transaction });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};
