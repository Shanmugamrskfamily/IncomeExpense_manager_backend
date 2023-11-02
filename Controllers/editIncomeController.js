const Transaction = require('../Models/transactionsModel');
// const moment = require('moment');

exports.editIncomeTransaction = async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactionId = req.params.transactionId;
    const { title, amount, category, description, date } = req.body;

    // Find the transaction to be edited
    const transaction = await Transaction.findOne({ _id: transactionId, userId, type: 'income' });

    if (!transaction) {
      return res.status(404).json({ message: 'Income transaction not found for the user.' });
    }

    // Update the transaction data
    transaction.title = title;
    transaction.amount = amount;
    transaction.category = category;
    transaction.date = date; // Ensure date is consistent with how it's handled on the client side
    transaction.description = description;

    // Save the updated transaction
    await transaction.save();

    res.status(200).json({ message: 'Income transaction updated successfully', updatedTransaction: transaction });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};
