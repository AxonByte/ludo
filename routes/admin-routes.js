const express = require("express");
const { updateKycStatus } = require("../controllers/admin-controller");
const { auth, authorizeAdmin } = require("../middleware/auth");

const router = express.Router();

// Admin update KYC status
router.put("/kyc/:userId" ,auth,authorizeAdmin, updateKycStatus);

module.exports = router;
