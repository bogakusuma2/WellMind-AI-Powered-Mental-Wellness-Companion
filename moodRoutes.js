const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  logMood,
  getMoodHistory,
  getAverageMoodScore,
  saveCheckIn,
} = require("../controllers/moodController");

router.post("/", auth, logMood);
router.post("/check-in", auth, saveCheckIn);
router.get("/history", auth, getMoodHistory);
router.get("/average", auth, getAverageMoodScore);

module.exports = router;