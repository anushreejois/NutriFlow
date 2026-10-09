# 🌿 NutriFlow AI: Biological Operating System

NutriFlow is a high-inference AI-powered health platform designed to bridge the gap between static nutrition plans and dynamic human biology. It leverages advanced LLMs to personalize nutrition, fitness, and recovery based on individual hormonal patterns and lifestyle data.

---

## 🚀 Core Features

### 🧬 Phase-Sync Engine (Hormonal Intelligence)

* Adapts nutrition and training based on biological cycles
* Dynamically adjusts macro-nutrients using hormonal insights
* Supports cycle-aware optimization (PCOS & hormonal balance)

---

### 🤖 NutriBot AI Assistant

* Natural language interaction for real-time adjustments
* Modify meals, calories, or plans instantly
* Maintains biological consistency across recommendations
* Provides general wellness information only; it does not diagnose or treat conditions

AI-generated plans are checked for required fields and reasonable value ranges before
they are returned or saved. If a model produces an invalid plan, NutriFlow tries the
configured fallback model. Allergy details can be included in the plan form, but AI
cannot guarantee allergen safety: always verify ingredients and labels, including
cross-contact warnings, and consult a qualified healthcare professional for medical
conditions or treatment decisions.

---

### 🔒 Bio-Vault (Secure Data Layer)

* Stores user health protocols securely
* Tracks long-term biological and metabolic patterns
* Enables data-driven health insights

---

### ⚡ Ultra-Low Latency AI Inference

* Powered by open-weight language models served through Groq
* Generates complete personalized plans instantly
* Optimized for fast and seamless UX

---

## 🏗️ System Architecture

```text
Frontend (React + Tailwind)
        ↓
API Layer (Node.js / Express)
        ↓
AI Engine (Qwen with ALLaM fallback via Groq)
        ↓
Database (MongoDB Atlas)
```

---

## 🛠️ Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Frontend       | React.js, TypeScript, Tailwind CSS |
| Animations     | Framer Motion                      |
| Backend        | Node.js / Express                  |
| Database       | MongoDB Atlas                      |
| Authentication | Clerk Auth                         |
| AI Engine      | Qwen (primary), ALLaM (fallback), via Groq |
| Notifications  | OneSignal                          |

---

## 📦 Installation & Setup

### Run the full application with Docker

Docker Compose runs the production-built React client and Express API. The client
serves the app on port `8080` and proxies `/api` requests to the API container.
MongoDB remains external and uses the URI in `server/.env`.

### API route conventions

New client requests use the versioned `/api/nutriflow/v1/` prefix, followed by a
lowercase kebab-case feature path. For example:

| Feature | Route |
| --- | --- |
| Plans | `/api/nutriflow/v1/plans/generate-plan` |
| NutriBot | `/api/nutriflow/v1/nutri-bot/chat` |
| Users | `/api/nutriflow/v1/users/profile/{id}` |
| Habits | `/api/nutriflow/v1/habits/weekly/{userId}` |
| Blogs | `/api/nutriflow/v1/blogs` |
| Routines | `/api/nutriflow/v1/routines/summary/{userId}/{startDate}/{endDate}` |

The previous `/api/plans`, `/api/bot`, `/api/user`, `/api/users`, `/api/habits`,
`/api/blogs`, and `/api/routine` prefixes remain available as compatibility
aliases. The client has moved to the versioned routes; remove the aliases only
after external consumers have migrated.

1. Create `client/.env` from `client/.env.example` and set the Clerk publishable
   key and OneSignal app ID. These `VITE_*` settings are embedded in the browser
   bundle and must not contain server secrets.
2. Create `server/.env` from `server/.env.example` and set the MongoDB URI,
   Clerk secret and publishable keys, and Groq keys. Get both Clerk keys from
   the same application in the Clerk dashboard. The publishable key is public;
   keep the secret key private and never commit it. The API
   verifies Clerk session tokens and scopes private records to the signed-in
   account. If MongoDB is running on the same host as Docker, use
   `host.docker.internal` instead of `localhost` as the URI hostname. Make sure
   the MongoDB server permits connections from your Docker host.
3. From the repository root, run:

   ```bash
   docker compose --env-file client/.env up --build
   ```

4. Open [http://localhost:8080](http://localhost:8080). The API is also
   available at [http://localhost:5000](http://localhost:5000) on the host.

To stop the containers, run `docker compose down`. To rebuild after changing
frontend build-time settings in `client/.env`, run the `up --build` command
again.

### Deploy to Vercel and Render

The client is a Vite single-page application and the API is a separate Express
service. Deploy the client to Vercel and the API to Render; the Vercel rewrite
in `client/vercel.json` supports direct navigation to React Router routes.

1. Create a Render Blueprint from the repository-root `render.yaml`. It builds
   the API with `npm ci && npm run build` and
   starts it with `npm start`.
2. Add the required API environment values in Render:
   `MONGO_URI`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `GROQ_API_KEY`,
   `GROK_BOT_KEY`, and `CLIENT_URL`. Set `CLIENT_URL` to the final Vercel
   production origin (for example, `https://your-app.vercel.app`). Do not put
   secret values in this repository. Use matching Clerk keys from the same
   production Clerk application.
3. In Vercel, import this repository and set the project Root Directory to
   `client`. Use `npm run build` as the build command and `dist` as the output
   directory. Add these client environment variables for Production:
   `VITE_CLERK_PUBLISHABLE_KEY` (the matching Clerk production publishable key)
   and `VITE_API_URL` (the API origin followed by `/api`, for example
   `https://nutriflow-api.onrender.com/api`). Set `VITE_ONESIGNAL_APP_ID` if
   browser push notifications are configured.
4. After Vercel gives the project its production URL, set that exact origin as
   Render's `CLIENT_URL` and add it to the allowed origins in the matching
   Clerk production application. Redeploy the API if `CLIENT_URL` changed.
5. Ensure MongoDB Atlas network access allows connections from the API host.
   Prefer a restricted/static outbound IP when available; avoid opening the
   database to all IP addresses. Deploy the Vercel client again after changing
   its environment variables.

The API must remain independently reachable from the browser; `VITE_API_URL`
is embedded into the client bundle at build time and must not contain secrets.
Use the same Clerk application for the browser publishable key and the API
secret/publishable keys.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/anushreejois/NutriFlow.git
cd NutriFlow
```

---

### Install Dependencies

#### Frontend

```bash
cd client && npm ci
```

#### Backend (Node.js)

```bash
cd server && npm ci
```

### Run Locally

```bash
npm run dev
```

---

## 🛡️ Security & Privacy

* 🔐 AES-256 encryption for sensitive data
* 🧑‍💻 Clerk-based authentication (no password storage)
* 🧠 AI requests anonymized before processing
* 🔒 Secure API communication

---

## 📈 Impact

* Personalized nutrition through AI-driven biological modeling
* Improved user engagement with adaptive recommendations
* Real-time protocol generation using low-latency AI inference
* Scalable architecture for future health-tech expansion

---

## 🚀 Future Enhancements

* 🧠 Advanced AI-driven health predictions
* 📊 Deep analytics dashboard
* 📱 Mobile application
* 🔔 Smart health alerts & reminders

---

## 👩‍💻 Author

**Anushree H.S Jois**
📍 Bengaluru, India
🔗 https://github.com/anushreejois

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
