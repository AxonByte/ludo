const otpStore = new Map(); // Temporary store for OTPs (use a database like Redis in production)

// Generate OTP
const generateOtp = (phoneNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  otpStore.set(phoneNumber, otp);
  setTimeout(() => otpStore.delete(phoneNumber), 300000); // OTP expires in 5 minutes
  return otp;
};

// Verify OTP
const verifyOtp = (phoneNumber, otp) => {
  return otpStore.get(phoneNumber) === otp;
};

module.exports = { generateOtp, verifyOtp };
