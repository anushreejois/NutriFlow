# NutriFlow AI 🌿

**AI-powered nutrition and wellness platform that syncs with your biological rhythm.**

NutriFlow uses Llama-3 AI to generate personalized meal plans, workout protocols, and wellness recommendations adapted to your hormonal cycle phases, body metrics, and lifestyle goals.

## Features

- **🧠 AI Plan Generation** — Personalized meal + workout plans based on your biometrics
- **🤖 NutriBot** — Real-time AI chat assistant for health questions
- **🏦 Bio-Vault** — Chronological archive of all generated protocols
- **📊 Trackers** — Water intake, habit logging, cycle prediction, workout logging
- **🔥 108-Day Challenge** — Progressive daily wellness challenges with streak tracking
- **📓 Routine** — Daily routine management with gym splits and weekly summaries
- **📚 Health Library** — Community blog for sharing wellness insights
- **🌙 Dark Mode** — Full dark mode support with system preference detection

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| AI Engine | Groq SDK (Llama-3.3-70b) |
| Auth | Clerk (SSO, Social Login) |
| Notifications | OneSignal |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Groq API key
- Clerk account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/nutriflow-ai.git
   cd nutriflow-ai
   ```

2. **Install dependencies**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. **Configure environment variables**
   
   Client (`.env`):
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   VITE_API_URL=http://localhost:5000/api
   VITE_ONESIGNAL_APP_ID=your_onesignal_id
   ```
   
   Server (`.env`):
   ```
   MONGO_URI=your_mongodb_uri
   GROQ_API_KEY=your_groq_key
   GROK_BOT_KEY=your_bot_key
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   ```

4. **Run development servers**
   ```bash
   # Terminal 1: Backend
   cd server && npm run dev
   
   # Terminal 2: Frontend
   cd client && npm run dev
   ```

## Project Structure

```
nutriflow-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── services/       # API service layer
│   │   └── App.tsx         # Root component & routing
│   └── tailwind.config.js
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   └── services/       # AI service (Groq)
│   └── index.ts
└── README.md
```

## License

MIT © Anushree H S Jois
