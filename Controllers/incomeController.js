// incomeController.js
const Income = require('../Models/incomeModel');
const moment = require('moment');

exports.addIncome = async (req, res) => {
  try {
    const { userId, userName, title, amount, category, description,date } = req.body;
    const formattedDate = moment(date).format('DD-MM-YYYY');
    const income = new Income({ userId, userName, title, amount,date:formattedDate, category, description });

    await income.save();

    res.status(201).json({ message: 'Income added successfully', income });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.',error });
  }
};
