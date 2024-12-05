const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String, // e.g., "credit" or "debit"
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String, // e.g., "Game Win", "Funds Added", "Entry Fee"
  },
});

module.exports = mongoose.model("Transactions", TransactionSchema);
