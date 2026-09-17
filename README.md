
# WellMind — AI-Powered Mental Wellness Companion

WellMind is a mental wellness mobile application built 
for students aged 16 to 25. It provides daily 
mood tracking, personalized AI conversation, wellness 
content, and a smart escalation pathway to college 
counselors.

Built by Team Mind Bloom.

---

## Team

| Name | Role |
|---|---|
| Shreyas S | Project Lead, Backend Developer |
| Venkata Sai Thanooja | Backend Developer — Alerts System |
| Venkata Thanmai | Frontend Developer — Content and Mood History |
| Kusuma Boga | Frontend Developer — Profile and Navigation |

---

## Features

### Working in Current Version
- User registration and login with JWT authentication
- Daily mood logging with mood type, score, journal 
  note, sleep hours, and trigger
- AI chat companion with session memory
- Automatic distress detection from chat messages
- Alert and SOS emergency system
- Wellness content library with bookmarks and ratings
- Mood history and profile screen
- PostgreSQL database with 24 fully structured tables

### Roadmap
- Voice and expression based mood detection
- Anonymous student community stories feed
- Weekly AI-generated pattern insights
- Peer support circles
- Smart college counselor connection pathway

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native with Expo |
| Backend | Node.js with Express |
| Database | PostgreSQL |
| Authentication | JWT (JSON Web Tokens) |
| AI | OpenAI API (gpt-3.5-turbo) |
| API Communication | Axios |
| Local Storage | AsyncStorage |

---

## Project Structure
WellMind/
├── backend/
│ ├── src/
│ │ ├── config/ — database connection
│ │ ├── controllers/ — business logic
│ │ ├── middleware/ — auth and error handling
│ │ ├── routes/ — API endpoints
│ │ └── services/ — AI and notification services
│ ├── .env
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── screens/ — all app screens
│ │ ├── navigation/ — app navigation setup
│ │ ├── services/ — API service layer
│ │ └── components/ — reusable components
│ └── package.json
└── database/
└── schema.sql — full database schema