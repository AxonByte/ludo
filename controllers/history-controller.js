const History = require("../models/history");

// Add a new history entry
const addHistory = async (req, res) => {
  const { userId, oppositePlayerId, gameId, result, amount } = req.body;
  try {
    // Create new history entry
    const newHistory = new History({
      userId,
      oppositePlayerId,
      gameId,
      result,
      amount,
    });

    await newHistory.save();

    res.status(201).send({
      message: "Game history added successfully",
      history: newHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error adding game history", error });
  }
};

// Get user history with opposite players
const getUserHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await History.find({ userId })
      .populate("oppositePlayerId", "fullName phoneNumber") // Populate opponent details
      .sort({ createdAt: -1 });

    res.send({
      message: `Game history for user ${userId}`,
      history,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching game history", error });
  }
};

module.exports = { addHistory, getUserHistory };
