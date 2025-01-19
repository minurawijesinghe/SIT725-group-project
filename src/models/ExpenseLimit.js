const mongoose = require('mongoose');

const expenseLimitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Ensure each user can have only one limit
  },
  limit: {
    type: Number,
    required: true,
  },
  totalExpenses: {
    type: Number,
    default: 0, // Track the total expenses for the user
  },
}, {
  timestamps: true,
});

// Prevent OverwriteModelError by checking if the model exists
module.exports = mongoose.models.ExpenseLimit || mongoose.model('ExpenseLimit', expenseLimitSchema);
