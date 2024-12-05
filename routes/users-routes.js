const express = require("express");
const { registerUser, loginUser, verifyUserOtp, updateProfile, uploadKyc, getKycStatus, refreshAccessToken } = require("../controllers/users-controllers");
const upload = require("../utils/fileUploader");

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login and request OTP
router.post("/login", loginUser);

// Verify OTP
router.post("/verify-otp", verifyUserOtp);

router.put("/profile/:userId", updateProfile);

// Upload KYC document
router.post("/profile/:userId/kyc", upload.single("documentFile"), uploadKyc);

// Get KYC status
router.get("/profile/:userId/kyc", getKycStatus);
router.post("/refresh-token", refreshAccessToken);
module.exports = router;
