const express = require('express');
const cors = require('cors');
require('dotenv').config();
console.log("OpenAI Key Loaded:", process.env.OPENAI_API_KEY ? "YES" : "NO");
console.log("Gemini API key configured:", process.env.GEMINI_API_KEY ? "YES" : "NO");
require('./config/db');

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const aiRoutes = require("./routes/aiRoutes");

const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
//app.options('*', cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/conversation', conversationRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'WellMind API running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;