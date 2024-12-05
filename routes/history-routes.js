const express = require("express");
const { addHistory, getUserHistory } = require("../controllers/history-controller");

const router = express.Router();

// Add new history entry
router.post("/", addHistory);

// Get history for a specific user
router.get("/:userId", getUserHistory);

module.exports = router;
