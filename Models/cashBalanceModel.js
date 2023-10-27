//cashBalanceModel.js
const mongoose = require('mongoose');

const cashBalanceSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model('CashBalance', cashBalanceSchema);
