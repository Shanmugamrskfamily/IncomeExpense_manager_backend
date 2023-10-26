// incomeController.js
const Transaction = require('../Models/transactionsModel');
const moment = require('moment');

exports.addIncome = async (req, res) => {
  try {
    const { userId, userName, title, amount, category, type, description,date } = req.body;
    const formattedDate = moment(date).format('DD-MM-YYYY');
    const income = new Transaction({ userId, userName, title, amount,date:formattedDate,type, category, description });

    await income.save();

    res.status(201).json({ message: 'Income added successfully', income });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.',error });
  }
};
