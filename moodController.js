const pool = require('../config/db');

// Log a mood
const logMood = async (req, res) => {
  const user_id = req.user.user_id;
  const { mood_type_id, mood_score, journal_notes,
          sleep_hours, trigger_type_id } = req.body;

  if (!mood_type_id || !mood_score) {
    return res.status(400).json({ error: 'Mood type and score are required.' });
  }

  try {
    const now = new Date();
    const result = await pool.query(
      `INSERT INTO mood_log
        (user_id, mood_type_id, mood_score, journal_notes,
         sleep_hours, log_date, log_time, trigger_type_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [user_id, mood_type_id, mood_score, journal_notes,
       sleep_hours, now.toISOString().split('T')[0],
       now.toTimeString().split(' ')[0], trigger_type_id]
    );

    res.status(201).json({
      message: 'Mood logged successfully.',
      log: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get mood history for a user
const getMoodHistory = async (req, res) => {
  const user_id = req.user.user_id;
  const { from_date, to_date } = req.query;

  try {
    let query = `
      SELECT ml.*, mt.mood_name, tt.trigger_name
      FROM mood_log ml
      LEFT JOIN mood_type mt ON ml.mood_type_id = mt.mood_type_id
      LEFT JOIN trigger_type tt ON ml.trigger_type_id = tt.trigger_type_id
      WHERE ml.user_id = $1
    `;
    const params = [user_id];

    if (from_date && to_date) {
      query += ` AND ml.log_date BETWEEN $2 AND $3`;
      params.push(from_date, to_date);
    }

    query += ` ORDER BY ml.log_date DESC, ml.log_time DESC`;

    const result = await pool.query(query, params);
    res.json({ logs: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get average mood score
const getAverageMoodScore = async (req, res) => {
  const user_id = req.user.user_id;
  const { days } = req.query;

  try {
    const result = await pool.query(
      `SELECT ROUND(AVG(mood_score), 2) AS average_score
       FROM mood_log
       WHERE user_id = $1
         AND log_date >= CURRENT_DATE - INTERVAL '${parseInt(days) || 7} days'`,
      [user_id]
    );
    res.json({ average_score: result.rows[0].average_score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save a wellness check-in
const saveCheckIn = async (req, res) => {
  const user_id = req.user?.user_id;
  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized user." });
  }

  const { transcript, analysis } = req.body;

  if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
    return res.status(400).json({ error: "Transcript is required." });
  }

  if (!analysis || typeof analysis !== 'object') {
    return res.status(400).json({ error: "Wellness analysis data is required." });
  }

  const {
    summary,
    mood,
    stress,
    energy,
    confidence,
    observations = [],
    suggestions = [],
  } = analysis;

  if (!summary || !mood || !stress || !energy || !confidence) {
    return res.status(400).json({ error: "Incomplete wellness analysis fields." });
  }

  try {
    // Prevent duplicate submissions (if submitted twice within 10 seconds)
    const existing = await pool.query(
      `SELECT * FROM check_in 
       WHERE user_id = $1 AND transcript = $2 
         AND created_at > NOW() - INTERVAL '10 seconds'
       ORDER BY created_at DESC LIMIT 1`,
      [user_id, transcript]
    );

    if (existing.rows.length > 0) {
      console.log(`[check-in] Duplicate submission detected for user ${user_id}. Returning existing record.`);
      return res.status(200).json({
        message: 'Check-in already saved.',
        checkIn: existing.rows[0]
      });
    }

    const result = await pool.query(
      `INSERT INTO check_in
        (user_id, transcript, summary, mood, stress, energy, confidence, observations, suggestions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        user_id,
        transcript,
        summary,
        mood,
        stress,
        energy,
        confidence,
        JSON.stringify(Array.isArray(observations) ? observations : []),
        JSON.stringify(Array.isArray(suggestions) ? suggestions : []),
      ]
    );

    console.log(`[check-in] Check-in ID ${result.rows[0].id} saved successfully for user ${user_id}.`);

    res.status(201).json({
      message: 'Check-in saved successfully.',
      checkIn: result.rows[0]
    });
  } catch (err) {
    console.error('[check-in] Error saving check-in:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { logMood, getMoodHistory, getAverageMoodScore, saveCheckIn };