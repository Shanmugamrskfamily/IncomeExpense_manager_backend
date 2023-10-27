//cumulativeUserExpenseModel.js
const mongoose = require('mongoose');

const cumulativeUserExpenseSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  totalExpense: { type: Number, default: 0 },
});

module.exports = mongoose.model('CumulativeUserExpense', cumulativeUserExpenseSchema);
