const express = require("express");
const router = express.Router();

const {
  viewWallet,
  addFunds,
  deductFunds,
  transferFunds,
} = require("../controllers/wallet-controller");
const { auth } = require("../middleware/auth");

router.get("", auth, viewWallet);
router.post("/add-funds", auth, addFunds);
router.post("/deduct-funds", auth, deductFunds);
router.post("/transfer-funds", auth, transferFunds);

module.exports = router;
