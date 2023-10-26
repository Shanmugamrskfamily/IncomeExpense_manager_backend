// transactionModel.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date:{type:Date, required:true},
  category: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
},{
    timestamps: true
  });

module.exports = mongoose.model('Transaction', transactionSchema);
