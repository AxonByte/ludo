const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Player
  oppositePlayerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Opponent
  gameId: { type: String, required: true }, // Unique identifier for the game
  result: { type: String, enum: ["win", "loss"], required: true }, // Win or loss
  amount: { type: String, required: true }, // Amount won or lost
  createdAt: { type: Date, default: Date.now }, // Date of the game
});

module.exports = mongoose.model("History", historySchema);
