// incomeModel.js
const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date:{type:Date, required:true},
  category: { type: String, required: true },
  description: { type: String,required: true},
  type: { type: String, default: 'income' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Income', incomeSchema);
