const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  countryCode: { type: String, required: true }, // New field for country code
  referral: { type: String },
  userType: { type: String, default: "user" },
  kyc: { type: mongoose.Schema.Types.ObjectId, ref: "Kyc" },
  createdAt: { type: Date, default: Date.now }, 
});

const User = mongoose.model("User", userSchema);

module.exports = User;
