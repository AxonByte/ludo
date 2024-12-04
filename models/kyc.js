const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  documentType: { type: String, required: true }, // e.g., "Aadhar", "Passport"
  documentNumber: { type: String, required: true, unique: true },
  documentFile: { type: String, required: true }, // File path
  verified: { type: Boolean, default: false },    // KYC verification status
});

const Kyc = mongoose.model("Kyc", kycSchema);

module.exports = Kyc;
