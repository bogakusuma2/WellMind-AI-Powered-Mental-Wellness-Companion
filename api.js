import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.0.106:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  // ─── Debug ──────────────────────────────────────────────────────────────
  console.log('========== API REQUEST ==========');
  console.log(config.method);
  console.log((config.baseURL || '') + config.url);

  const token = await AsyncStorage.getItem("wellmind_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─── Debug: Response Interceptor ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    console.log('========== API RESPONSE ==========');
    console.log(response.status);
    console.log(response.data);
    return response;
  },
  (error) => {
    console.log('========== API FAILED ==========');
    console.log(error.message);
    console.log(error.response?.status);
    console.log(error.response?.data);
    return Promise.reject(error);
  }
);

// ================= AUTH =================

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const getProfile = () =>
  api.get("/auth/profile");

// ================= MOOD =================

export const logMood = (data) =>
  api.post("/mood", data);

export const getMoodHistory = () =>
  api.get("/mood/history");

export const getAverageMood = (days = 7) =>
  api.get("/mood/average", {
    params: { days },
  });

export const saveCheckIn = (checkInData) =>
  api.post("/mood/check-in", checkInData);

// ================= BEHAVIORAL =================

// Computes behavioral risk for a user
export const computeBehavioralRisk = (userId) =>
  api.post(`/behavioral/compute/${userId}`);

// ================= CONVERSATION =================

// Create a new chat session
export const startSession = () =>
  api.post("/conversation/sessions");

// Send a message
export const sendMessage = (data) =>
  api.post("/conversation/messages", data);

// Load previous messages
export const getSessionHistory = (sessionId) =>
  api.get(`/conversation/sessions/${sessionId}`);

// ================= AI / TRANSCRIPTION =================

// Upload a recorded audio file and get back a transcript from Whisper
export const transcribeAudio = (audioUri, mimeType = "audio/m4a") => {
  const formData = new FormData();
  formData.append("audio", {
    uri: audioUri,
    name: "recording.m4a",
    type: mimeType,
  });
  return api.post("/ai/transcribe", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Send a transcript to the backend and receive a structured wellness analysis.
// Backend reads AI_ANALYSIS_MODE from .env:
//   "mock" → returns realistic mock data (no OpenAI call)
//   "real" → calls OpenAI GPT for live analysis
export const analyzeWellness = (transcript) =>
  api.post("/ai/analyze", { transcript });

// ================= EXPORT =================

export default api;