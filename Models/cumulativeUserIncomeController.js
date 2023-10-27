//cumulativeUserIncomeModel.js
const mongoose = require('mongoose');

const cumulativeUserIncomeSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  totalIncome: { type: Number, default: 0 },
});

module.exports = mongoose.model('CumulativeUserIncome', cumulativeUserIncomeSchema);
