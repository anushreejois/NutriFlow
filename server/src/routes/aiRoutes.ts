import express from 'express';
import { generatePlan } from '../services/gemini'; // Your Groq service
import Plan from '../models/Plan';

const router = express.Router();

// 1. GET ALL PLANS FOR A USER (Fixes the 404 in BioVault)
router.get('/:userId', async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bio-vault history" });
  }
});

// 2. SAVE A PLAN TO THE VAULT
router.post('/save', async (req, res) => {
  try {
    const { userId, formData, aiResponse } = req.body;
    const newPlan = await Plan.create({
      userId,
      formData,
      aiResponse,
      date: new Date()
    });
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ error: "Failed to save plan to database" });
  }
});

// 3. GENERATE INITIAL PLAN
router.post('/generate-plan', async (req, res) => {
  try {
    const { userId, ...formData } = req.body;
    const aiRawText = await generatePlan(req.body);

    if (!aiRawText) return res.status(500).json({ error: "Generation failed" });

    // Save to DB immediately if userId is provided
    if (userId) {
      await Plan.create({
        userId,
        formData,
        aiResponse: aiRawText
      });
      console.log("✅ Plan auto-saved to history");
    }

    res.json(JSON.parse(aiRawText));
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate or save plan" });
  }
});

// 4. ADJUST EXISTING PLAN
router.post('/adjust-plan', async (req, res) => {
  try {
    const { currentPlan, adjustmentRequest, userId, formData } = req.body;

    const prompt = `
      Current Plan: ${JSON.stringify(currentPlan)}
      Adjustment: "${adjustmentRequest}"
      Respond in exact JSON format.
    `;

    const updatedRawText = await generatePlan(prompt);
    
    if (!updatedRawText) return res.status(500).json({ error: "Adjustment failed" });

    // Save the adjusted version as a new entry in history
    if (userId) {
      await Plan.create({
        userId,
        formData,
        aiResponse: updatedRawText
      });
    }

    res.json(JSON.parse(updatedRawText));
  } catch (error: any) {
    res.status(500).json({ error: "Failed to adjust plan" });
  }
});

export default router;