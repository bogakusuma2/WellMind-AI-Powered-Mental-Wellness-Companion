const pool = require("../config/db");
const axios = require("axios");

// ── Start a new session ───────────────────────────────────────────────────────
const startSession = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const result = await pool.query(
      `INSERT INTO conversation_session
      (user_id, start_time, session_status)
      VALUES ($1, NOW(), 'Active')
      RETURNING
      session_id,
      user_id,
      start_time,
      session_status`,
      [user_id]
    );

    return res.status(201).json({
      message: "Session started.",
      session: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
};
// ── Send a message and get AI reply ──────────────────────────────────────────
const sendMessage = async (req, res) => {
  const user_id = req.user.user_id;
  const { session_id, message_text } = req.body;

  if (!session_id || !message_text) {
    return res.status(400).json({
      error: "session_id and message_text are required.",
    });
  }

  try {
    // 1. Save user message
    const userMsgResult = await pool.query(
      `INSERT INTO message
      (session_id, sender, message_text, sent_at, is_flagged)
      VALUES ($1, 'User', $2, NOW(), false)
      RETURNING *`,
      [session_id, message_text]
    );

    const userMessage = userMsgResult.rows[0];

    // 2. Get AI configuration
    const configResult = await pool.query(
      `SELECT ac.response_tone,
              ac.distress_keyword_list,
              ac.escalation_threshold_score
       FROM ai_configuration ac
       JOIN "user" u
         ON u.user_type_id = ac.user_type_id
       WHERE u.user_id = $1`,
      [user_id]
    );

    const config = configResult.rows[0] || {
      response_tone: "Friendly",
      distress_keyword_list:
        "hopeless,worthless,end it,hurt myself,suicidal",
      escalation_threshold_score: 3,
    };

    // 3. Get previous messages
    const historyResult = await pool.query(
      `SELECT sender, message_text
       FROM message
       WHERE session_id = $1
       ORDER BY sent_at ASC
       LIMIT 10`,
      [session_id]
    );

    // 4. Build OpenAI messages
    const systemPrompt = `
You are WellMind, a compassionate mental health companion.
Respond in a ${config.response_tone} tone.
Be supportive, empathetic and understanding.
Keep responses concise (2–4 sentences).
Never diagnose.
Never give medical advice.
`;

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },

      ...historyResult.rows.map((msg) => ({
        role: msg.sender === "User" ? "user" : "assistant",
        content: msg.message_text,
      })),

      {
        role: "user",
        content: message_text,
      },
    ];

    // 5. Distress detection
    const keywords = (config.distress_keyword_list || "")
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);

    const messageTextLower = message_text.toLowerCase();

    const isDistressed = keywords.some((k) =>
      messageTextLower.includes(k)
    );

    if (isDistressed) {
      await pool.query(
        `UPDATE message
         SET is_flagged = true
         WHERE message_id = $1`,
        [userMessage.message_id]
      );

      await pool.query(
        `INSERT INTO alert
        (user_id,
         alert_type_id,
         trigger_description,
         severity_level,
         alert_status,
         created_at)
         VALUES
         ($1, 3, $2, 'High', 'New', NOW())`,
        [
          user_id,
          `Distress keyword detected in message: "${message_text}"`,
        ]
      );
    }

    // 6. Default fallback
    let aiText =
      "I'm here for you. Could you tell me more about how you're feeling?";

    try {
      const openaiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages,
          max_tokens: 200,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.AI_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      aiText =
        openaiResponse.data.choices[0].message.content.trim();
    } catch (openaiErr) {
      console.log("OpenAI unavailable:");
      console.log(openaiErr.response?.data || openaiErr.message);
    }

    // 7. Save AI response
    const aiMsgResult = await pool.query(
      `INSERT INTO message
      (session_id, sender, message_text, sent_at, is_flagged)
      VALUES ($1, 'AI', $2, NOW(), false)
      RETURNING *`,
      [session_id, aiText]
    );

    return res.status(201).json({
      message: "Message sent.",
      userMessage,
      aiMessage: aiMsgResult.rows[0],
      isDistressed,
    });

  } catch (err) {
    console.error("========== SEND MESSAGE ERROR ==========");
    console.error(err);
    console.error("========================================");

    return res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};
// ── Get all messages in a session ─────────────────────────────────────────────
const getSessionMessages = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT message_id,
              sender,
              message_text,
              sent_at,
              is_flagged
       FROM message
       WHERE session_id = $1
       ORDER BY sent_at ASC`,
      [id]
    );

    res.json({
      messages: result.rows,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  startSession,
  sendMessage,
  getSessionMessages,
};