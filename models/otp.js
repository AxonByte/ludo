const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  countryCode: { type: String, required: true }, // New field for country code
  phoneNumber: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Expires in 5 minutes
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
