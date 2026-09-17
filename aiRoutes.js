const express = require("express");
const OpenAI = require("openai");
const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");
const { Readable } = require("stream");

const router = express.Router();

// Initialize OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Gemini client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

// Store uploaded audio in memory (no disk write needed)
const upload = multer({ storage: multer.memoryStorage() });

// ── GET /api/ai/gemini-test ──────────────────────────────────────────────────
router.get("/gemini-test", async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                error: "GEMINI_API_KEY is not configured in backend/.env."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: "Reply with exactly: Gemini connection successful.",
        });

        res.json({
            success: true,
            message: response.text ? response.text.trim() : "Gemini connection successful.",
        });
    } catch (error) {
        console.error("[gemini-test] Error:", error.message);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to communicate with Gemini API."
        });
    }
});

// ── GET /api/ai/test ──────────────────────────────────────────────────────────
router.get("/test", async (req, res) => {
    try {
        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            input: "Say hello to the WellMind project in one sentence.",
        });

        res.json({
            success: true,
            message: response.output_text,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── POST /api/ai/transcribe ───────────────────────────────────────────────────
//
// Controlled by AI_TRANSCRIPTION_MODE in backend/.env:
//   "mock" → skips OpenAI, returns a fallback transcript (saves API credits).
//   "real" → calls OpenAI Whisper for live transcription.
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_TRANSCRIPT =
    "Today was a little stressful. I had a lot of work to complete, " +
    "but I managed to finish most of it. I am feeling slightly tired, " +
    "but overall I feel okay.";

router.post("/transcribe", upload.single("audio"), async (req, res) => {
    try {
        // ── DIAGNOSTIC 1: Did multer receive the file? ─────────────────────────
        if (!req.file) {
            console.error("[transcribe][DIAG] ✗ Multer did NOT receive a file. req.file is undefined.");
            console.error("[transcribe][DIAG]   Content-Type header:", req.headers["content-type"]);
            return res.status(400).json({ success: false, error: "No audio file received." });
        }

        // ── DIAGNOSTIC 2: File metadata ────────────────────────────────────────
        console.log("[transcribe][DIAG] ✓ Multer received file successfully.");
        console.log("[transcribe][DIAG]   originalname :", req.file.originalname);
        console.log("[transcribe][DIAG]   mimetype     :", req.file.mimetype);
        console.log("[transcribe][DIAG]   size (bytes) :", req.file.size);

        // ── DIAGNOSTIC 3: Environment ──────────────────────────────────────────
        console.log("[transcribe][DIAG]   OPENAI_API_KEY configured :", process.env.OPENAI_API_KEY ? "YES" : "NO");
        console.log("[transcribe][DIAG]   AI_TRANSCRIPTION_MODE     :", process.env.AI_TRANSCRIPTION_MODE || "(not set — defaults to real)");

        const mode = (process.env.AI_TRANSCRIPTION_MODE || "real").toLowerCase();

        if (mode === "mock") {
            console.log("[transcribe][DIAG] Mode is MOCK — returning fallback transcript without calling Whisper.");
            return res.json({ success: true, transcript: MOCK_TRANSCRIPT });
        }

        // ── DIAGNOSTIC 4: About to call Whisper ───────────────────────────────
        console.log("[transcribe][DIAG] Starting Whisper transcription...");

        const audioStream = Readable.from(req.file.buffer);
        const audioFile = await OpenAI.toFile(audioStream, req.file.originalname || "audio.m4a", {
            type: req.file.mimetype || "audio/m4a",
        });

        const transcription = await client.audio.transcriptions.create({
            model: "whisper-1",
            file: audioFile,
        });

        // ── DIAGNOSTIC 5: Whisper succeeded ───────────────────────────────────
        console.log("[transcribe][DIAG] ✓ Whisper transcription successful.");
        console.log("[transcribe][DIAG]   Transcript text:", transcription.text);

        res.json({ success: true, transcript: transcription.text });

    } catch (error) {
        // ── DIAGNOSTIC 6: Whisper (or upstream) failed ────────────────────────
        console.error("[transcribe][DIAG] ✗ Transcription error caught.");
        console.error("[transcribe][DIAG]   error.message :", error.message);
        console.error("[transcribe][DIAG]   HTTP status   :", error.status ?? error.response?.status ?? "(none)");
        console.error("[transcribe][DIAG]   OpenAI code   :", error.code   ?? "(none)");
        console.error("[transcribe][DIAG]   OpenAI type   :", error.type   ?? "(none)");
        // NOTE: API key is intentionally NOT logged
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── POST /api/ai/analyze ──────────────────────────────────────────────────────
//
// Accepts JSON: { "transcript": "user's transcript here" }
//
// Controlled by AI_ANALYSIS_MODE in backend/.env:
//   "mock" → returns realistic mock analysis without calling Gemini.
//   "real" → calls Google Gemini API (gemini-3.6-flash) for live wellness analysis.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/analyze", async (req, res) => {
    try {
        const { transcript } = req.body;

        if (!transcript || typeof transcript !== "string" || transcript.trim().length === 0) {
            return res.status(400).json({ success: false, error: "No transcript provided." });
        }

        console.log(`[analyze] Received transcript (${transcript.length} chars)`);

        const mode = (process.env.AI_ANALYSIS_MODE || "real").toLowerCase();

        // ── MOCK MODE ─────────────────────────────────────────────────────────
        if (mode === "mock") {
            console.log("[DEV MODE] AI_ANALYSIS_MODE=mock — returning mock analysis.");
            console.log(`[DEV MODE] Transcript received: "${transcript.substring(0, 120)}..."`);

            const mockAnalysis = {
                summary:
                    "You had a fairly busy and slightly stressful day. Despite feeling tired, " +
                    "you were able to manage your responsibilities and finish most of your work.",
                mood: "Calm",
                stress: "Medium",
                energy: "Low",
                confidence: "94%",
                observations: [
                    "You mentioned feeling slightly tired.",
                    "You experienced some work-related stress.",
                    "You were still able to complete most of your responsibilities.",
                ],
                suggestions: [
                    "Take a short break and give yourself time to recharge.",
                    "Try a few minutes of slow breathing before your next task.",
                    "Avoid overloading yourself when you are already feeling tired.",
                    "Get enough rest tonight.",
                ],
            };

            return res.json({ success: true, analysis: mockAnalysis });
        }

        // ── REAL MODE (Google Gemini) ──────────────────────────────────────────
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                error: "GEMINI_API_KEY is missing from backend/.env."
            });
        }

        console.log("[analyze] AI_ANALYSIS_MODE=real — calling Google Gemini API.");

        const prompt = `You are WellMind, an empathetic student wellness check-in assistant.
Analyze ONLY the supplied student voice check-in transcript.

TRANSCRIPT:
"${transcript}"

RULES & CONSTRAINTS:
1. Return STRICT JSON only.
2. No markdown formatting, no code fences (no \`\`\`json).
3. Do NOT invent facts that were not present in the transcript.
4. Do NOT diagnose mental health conditions.
5. Do NOT claim certainty about emotions — treat the result as an AI interpretation of the user's words.
6. If the transcript is very short or unclear, reflect that uncertainty instead of inventing information.

JSON SCHEMA REQUIREMENT:
{
  "summary": "2-4 sentence empathetic summary of the person's check-in grounded ONLY in the transcript",
  "mood": "MUST be exactly one of: Happy, Sad, Stressed, Calm, Frustrated, Anxious, Neutral",
  "stress": "MUST be exactly one of: Low, Medium, High",
  "energy": "MUST be exactly one of: Low, Medium, High",
  "confidence": "percentage string such as '87%'",
  "observations": [
    "observation 1 grounded in transcript",
    "observation 2 grounded in transcript",
    "observation 3 grounded in transcript"
  ],
  "suggestions": [
    "practical supportive suggestion 1",
    "practical supportive suggestion 2",
    "practical supportive suggestion 3",
    "practical supportive suggestion 4"
  ]
}`;

        const geminiRes = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const rawText = geminiRes.text || "";
        console.log(`[analyze] Gemini raw response: ${rawText}`);

        // Safely clean markdown code fences if any exist
        const cleanedText = rawText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        let analysis;
        try {
            analysis = JSON.parse(cleanedText);
        } catch (parseErr) {
            console.error("[analyze] JSON parse error:", parseErr);
            return res.status(500).json({
                success: false,
                error: "Failed to parse AI wellness analysis response."
            });
        }

        // Validate required fields
        const requiredFields = ["summary", "mood", "stress", "energy", "confidence", "observations", "suggestions"];
        for (const field of requiredFields) {
            if (!analysis[field]) {
                return res.status(500).json({
                    success: false,
                    error: `AI response missing required field: ${field}`
                });
            }
        }

        if (!Array.isArray(analysis.observations) || analysis.observations.length === 0) {
            return res.status(500).json({
                success: false,
                error: "AI response observations must be a non-empty array."
            });
        }

        if (!Array.isArray(analysis.suggestions) || analysis.suggestions.length === 0) {
            return res.status(500).json({
                success: false,
                error: "AI response suggestions must be a non-empty array."
            });
        }

        console.log(`[analyze] Analysis successful. Mood: ${analysis.mood}, Stress: ${analysis.stress}`);

        res.json({ success: true, analysis });

    } catch (error) {
        console.error("[analyze] Error calling Gemini API:", error.message);
        res.status(500).json({
            success: false,
            error: error.message || "An error occurred during AI analysis."
        });
    }
});

module.exports = router;