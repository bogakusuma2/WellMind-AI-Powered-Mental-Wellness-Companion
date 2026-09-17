const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/authMiddleware');
const {
  startSession,
  sendMessage,
  getSessionMessages,
} = require('../controllers/conversationController');

router.post('/sessions',          auth, startSession);
router.post('/messages',          auth, sendMessage);
router.get('/sessions/:id',       auth, getSessionMessages);

module.exports = router;