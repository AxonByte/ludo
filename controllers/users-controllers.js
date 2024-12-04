const User = require("../models/users");
const Otp = require("../models/otp");
const Kyc = require("../models/kyc");
const { generateAccessToken, generateRefreshToken } = require("../services/tokenService");

// Generate random OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register a new user
const registerUser = async (req, res) => {
  const { fullName, phoneNumber, countryCode, referral ,userType} = req.body;

  if (!fullName || !phoneNumber || !countryCode) {
    return res.status(400).send({ message: "Full name, phone number, and country code are required" });
  }

  try {
    const existingUser = await User.findOne({ phoneNumber, countryCode });
    if (existingUser) {
      return res.status(400).send({ message: "Phone number already registered" });
    }

    const user = new User({ fullName, phoneNumber, countryCode, referral ,userType });
    await user.save();

    res.status(201).send({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error", error });
  }
};

// Login and request OTP
const loginUser = async (req, res) => {
  const { phoneNumber, countryCode } = req.body;

  if (!phoneNumber || !countryCode) {
    return res.status(400).send({ message: "Phone number and country code are required" });
  }

  try {
    const user = await User.findOne({ phoneNumber, countryCode });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const otpCode = generateOtp();
    await Otp.create({ phoneNumber, countryCode, otp: otpCode });

    console.log(`Generated OTP for ${countryCode}${phoneNumber}: ${otpCode}`); // Replace with SMS logic

    res.send({ message: "OTP sent to your phone number" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error", error });
  }
};

// Verify OTP
const verifyUserOtp = async (req, res) => {
  const { phoneNumber, countryCode, otp } = req.body;

  if (!phoneNumber || !countryCode || !otp) {
    return res.status(400).send({ message: "Phone number, country code, and OTP are required" });
  }

  try {
    const existingOtp = await Otp.findOne({ phoneNumber, countryCode, otp });
    if (!existingOtp) {
      return res.status(400).send({ message: "Invalid or expired OTP" });
    }
    const user = await User.findOne({ phoneNumber });
    await Otp.deleteOne({ phoneNumber, countryCode, otp });
   const payload={
    userType:user.userType,
    _id:user._id
   }
   const acessToken = generateAccessToken(payload)
   const refreshToken =generateRefreshToken(payload)
    res.send({ message: "Login successful", phoneNumber,acessToken:acessToken ,refreshToken:refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error", error });
  }
};

const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { fullName, referral } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.fullName = fullName || user.fullName;
    user.referral = referral || user.referral;
    await user.save();

    res.send({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error", error });
  }
};

// Upload KYC
const uploadKyc = async (req, res) => {
  const { userId } = req.params;
  const { documentType, documentNumber } = req.body;

  if (!req.file) {
    return res.status(400).send({ message: "Document file is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const kyc = new Kyc({
      userId,
      documentType,
      documentNumber,
      documentFile: req.file.path,
    });

    await kyc.save();

    user.kyc = kyc._id;
    await user.save();

    res.status(201).send({ message: "KYC uploaded successfully", kyc });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error", error });
  }
};

// Get KYC Status
const getKycStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("kyc");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "KYC status retrieved", kyc: user.kyc });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error", error });
  }
};

module.exports = { registerUser, loginUser, verifyUserOtp,getKycStatus,uploadKyc,updateProfile };
