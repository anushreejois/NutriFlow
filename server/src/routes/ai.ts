import Groq from "groq-sdk";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

dotenv.config();
const router = express.Router();

// Initialize Groq with your BOT KEY
const groq = new Groq({
  apiKey: process.env.GROK_BOT_KEY, 
});

router.post("/chat", async (req: Request, res: Response) => {
  const { message, userData, history } = req.body;

  // 1. Construct the System Persona
  const systemPrompt = `
    You are NutriBot, a witty and expert biological health assistant for NutriFlow.
    User Profile: ${userData.name}, Gender: ${userData.gender}, Goal: ${userData.goal}, Diet: ${userData.dietary}.
    Current Phase: ${userData.currentPhaseName}.

    STRICT RULES:
    - Give concise, science-backed advice with a touch of wit.
    - Keep responses under 3 sentences.
    - Reference the user's current phase (${userData.currentPhaseName}) if relevant to their question.
  `;

  // 2. Format History for Groq (mapping 'bot' to 'assistant')
  const chatMessages = (history || []).map((msg: any) => ({
    role: msg.role === "bot" ? "assistant" : "user",
    content: msg.content,
  }));

  // 3. Model Rotation (Same as your generatePlan logic)
  const models = ["llama-3.3-70b-versatile", "llama3-70b-8192"];

  for (const model of models) {
    try {
      const completion = await groq.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          ...chatMessages, // Includes the previous context + current message
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const botReply = completion.choices[0]?.message?.content;
      if (!botReply) continue;

      console.log(`✅ NutriBot responded using: ${model}`);
      return res.json({ reply: botReply });

    } catch (error: any) {
      console.warn(`⚠️ NutriBot Model ${model} failed: ${error.message}`);
      if (model === models[models.length - 1]) {
        return res.status(500).json({ error: "All biological engines are offline." });
      }
    }
  }
});

export default router;