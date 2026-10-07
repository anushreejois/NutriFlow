import dotenv from 'dotenv';
// 1. MUST BE FIRST: Load variables before ANY other imports
dotenv.config(); 

import express, { Request, Response } from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import connectToDatabase from './config/db'; 
import apiRoutes from './routes/apiRoutes';

// --- BIOLOGICAL ENGINE PRE-FLIGHT CHECK ---
console.log("\n--- 🌿 NUTRIFLOW AI SYSTEM CHECK ---");

if (process.env.GROQ_API_KEY) console.log("🚀 PLAN ENGINE (GROQ): ✅ READY");
if (process.env.GROK_BOT_KEY) console.log("🤖 BOT ENGINE (GROK):  ✅ READY");
if (process.env.MONGO_URI)    console.log("📁 DATABASE CONFIG:    ✅ FOUND");
if (process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY) {
  console.log("🔐 CLERK AUTH CONFIG:   ✅ FOUND");
}
console.log("------------------------------------\n");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/api', clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
}));
app.use('/api', apiRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('NutriFlow AI API is running smoothly...');
});

const startServer = async () => {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY is required to authenticate API requests.');
  }
  if (!process.env.CLERK_PUBLISHABLE_KEY) {
    throw new Error('CLERK_PUBLISHABLE_KEY is required by Clerk API middleware.');
  }

  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`✅ NutriFlow Server live at: http://localhost:${PORT}`);
  });
};

void startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});