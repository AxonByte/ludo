const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");
const User = require("../models/users");
// View Wallet Balance with Transaction History
const viewWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const transactionHistory = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });

    res.status(200).json({
      balance: wallet.balance,
      transactionHistory,
    });
  } catch (error) {
    console.error("Error viewing wallet:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add Funds to Wallet
const addFunds = async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    let wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      wallet = new Wallet({ userId: req.user._id });
    }

    wallet.balance += amount;
    await wallet.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: req.user._id,
      type: "credit",
      amount,
      description: description || "Funds Added",
    });
    await transaction.save();

    res.status(200).json({ message: "Funds added successfully", balance: wallet.balance });
  } catch (error) {
    console.error("Error adding funds:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Deduct Funds from Wallet
const deductFunds = async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= amount;
    await wallet.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: req.user._id,
      type: "debit",
      amount,
      description: description || "Funds Deducted",
    });
    await transaction.save();

    res.status(200).json({ message: "Funds deducted successfully", balance: wallet.balance });
  } catch (error) {
    console.error("Error deducting funds:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Transfer Funds to Another User
const transferFunds = async (req, res) => {
  try {
    const { recipientId, amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const senderWallet = await Wallet.findOne({ userId: req.user._id });
    let recipientWallet = await Wallet.findOne({ userId: recipientId });

    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    if (!recipientWallet) {
        recipientWallet = new Wallet({ userId: recipientId, balance: 0 });
        await recipientWallet.save();
    }

    // Deduct from sender
    senderWallet.balance -= amount;
    await senderWallet.save();

    const senderTransaction = new Transaction({
      userId: req.user._id,
      type: "debit",
      amount,
      description: `Transfer to User: ${recipientId}`,
    });
    await senderTransaction.save();

    // Credit to recipient
    recipientWallet.balance += amount;
    await recipientWallet.save();

    const recipientTransaction = new Transaction({
      userId: recipientId,
      type: "credit",
      amount,
      description: `Transfer from User: ${req.user._id}`,
    });
    await recipientTransaction.save();

    res.status(200).json({ message: "Funds transferred successfully", balance: senderWallet.balance });
  } catch (error) {
    console.error("Error transferring funds:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { viewWallet, addFunds, deductFunds, transferFunds };
