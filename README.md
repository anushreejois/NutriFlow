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

---

### 🔒 Bio-Vault (Secure Data Layer)

* Stores user health protocols securely
* Tracks long-term biological and metabolic patterns
* Enables data-driven health insights

---

### ⚡ Ultra-Low Latency AI Inference

* Powered by LLM APIs (Groq / Llama-3)
* Generates complete personalized plans instantly
* Optimized for fast and seamless UX

---

## 🏗️ System Architecture

```text
Frontend (React + Tailwind)
        ↓
API Layer (Node.js / FastAPI)
        ↓
AI Engine (Llama-3 via Groq)
        ↓
Database (MongoDB Atlas)
```

---

## 🛠️ Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Frontend       | React.js, TypeScript, Tailwind CSS |
| Animations     | Framer Motion                      |
| Backend        | Node.js / Express / FastAPI        |
| Database       | MongoDB Atlas                      |
| Authentication | Clerk Auth                         |
| AI Engine      | Llama-3 (Groq Cloud)               |
| Notifications  | OneSignal                          |

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/anushreejois/NutriFlow.git
cd NutriFlow
```

---

### 2️⃣ Environment Variables

Create a `.env` file:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_GROQ_API_KEY=your_groq_key
VITE_ONESIGNAL_APP_ID=your_onesignal_id
DATABASE_URL=your_mongodb_uri
```

---

### 3️⃣ Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend (Node.js)

```bash
cd server
npm install
```

#### OR Backend (Python FastAPI)

```bash
cd backend
pip install -r requirements.txt
```

---

### 4️⃣ Run Locally

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
