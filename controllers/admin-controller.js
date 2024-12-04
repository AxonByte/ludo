const Kyc = require("../models/kyc");
const User = require("../models/users");

// Admin updates KYC status
const updateKycStatus = async (req, res) => {
  const { userId } = req.params;
  const { verified } = req.body;

  try {
    // Check if the KYC record exists for the user
    const kyc = await Kyc.findOne({ userId });

    if (!kyc) {
      return res.status(404).send({ message: "KYC document not found" });
    }

    // Update KYC verification status
    kyc.verified = verified;
    await kyc.save();

    // Optionally, update the user's KYC status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({
      message: `KYC status updated successfully for ${user.fullName}`,
      kyc: kyc,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error", error });
  }
};

module.exports = { updateKycStatus };
