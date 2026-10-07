import Groq from "groq-sdk";
import dotenv from "dotenv";
import { GROQ_CHAT_MODELS, withModelFallback } from "./modelFallback";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generatePlan = async (userData: any) => {
  let promptContent = "";

  // Check if we are adjusting an existing plan or creating a new one
  if (typeof userData === 'string') {
    // Input is the raw adjustment prompt from the route
    promptContent = userData;
  } else {
    // Input is a user data object - construct the full nutrition prompt
    const { age, weight, height, gender, cyclePhase, activityLevel, goal, dietary } = userData;
    
    promptContent = `
      Act as an expert nutritionist and hormonal health coach.
      
      *** CRITICAL DIETARY RULE ***
      The user follows a "${dietary}" diet.
      
      *** USER PROFILE ***
      - Gender: ${gender}, Age: ${age}, Weight: ${weight}kg, Height: ${height}cm
      - Activity: ${activityLevel}, Goal: ${goal}
      ${gender === 'female' ? `- Cycle Phase: ${cyclePhase}` : ''}

      *** OUTPUT FORMAT (STRICT JSON ONLY) ***
      {
        "summary": "2-sentence summary.",
        "meals": {
          "breakfast": { "item": "Name", "calories": 400, "benefits": "Why" },
          "lunch": { "item": "Name", "calories": 600, "benefits": "Why" },
          "dinner": { "item": "Name", "calories": 500, "benefits": "Why" },
          "snack": { "item": "Name", "calories": 200, "benefits": "Why" }
        },
        "workout": { "type": "Yoga/HIIT", "duration": "30 mins", "focus": "Focus description" }
      }
    `;
  }

  return withModelFallback(
    GROQ_CHAT_MODELS,
    async (model) => {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "You are a world-class nutritionist. Respond ONLY with valid JSON. No conversational filler."
          },
          {
            role: "user",
            content: promptContent,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) return undefined;

      console.log(`✅ AI Response generated using: ${model}`);
      return responseText;
    },
    (model, error) => {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`⚠️ Model ${model} failed: ${message}`);
    },
  );
};