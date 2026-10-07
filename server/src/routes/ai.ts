import Groq from "groq-sdk";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { GROQ_CHAT_MODELS, withModelFallback } from "../services/modelFallback";

dotenv.config();
const router = express.Router();

// Initialize Groq with your Groq key for the bot chat
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
  try {
    const botReply = await withModelFallback(
      GROQ_CHAT_MODELS,
      async (model) => {
        const completion = await groq.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...chatMessages, // Includes the previous context + current message
          ],
          temperature: 0.7,
          max_tokens: 300,
        });

        const botReply = completion.choices[0]?.message?.content;
        if (!botReply) return undefined;

        console.log(`✅ NutriBot responded using: ${model}`);
        return botReply;
      },
      (model, error) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn(`⚠️ NutriBot model ${model} failed: ${errorMessage}`);
      },
    );

    if (!botReply) {
      return res.status(500).json({ error: "All biological engines are offline." });
    }

    return res.json({ reply: botReply });
  } catch (error) {
    console.error("NutriBot request failed:", error);
    return res.status(500).json({ error: "All biological engines are offline." });
  }
});

export default router;