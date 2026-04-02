import Groq from "groq-sdk";
import dotenv from "dotenv";

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

  const models = ["llama-3.3-70b-versatile", "llama3-70b-8192"];

  for (const model of models) {
    try {
      const completion = await groq.chat.completions.create({
        model: model,
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
      if (!responseText) continue;

      console.log(`✅ AI Response generated using: ${model}`);
      return responseText;

    } catch (error: any) {
      console.warn(`⚠️ Model ${model} failed: ${error.message}`);
      if (model === models[models.length - 1]) throw error;
    }
  }
};