import express from 'express';
import { generatePlan } from '../services/gemini'; // Your Groq service
import Plan from '../models/Plan';
import { getCurrentUserId } from '../middleware/auth';

const router = express.Router();

// 1. GET ALL PLANS FOR A USER (Fixes the 404 in BioVault)
router.get('/:userId', async (req, res) => {
  try {
    const plans = await Plan.find({ userId: getCurrentUserId(req) }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bio-vault history" });
  }
});

// 1b. DELETE A PLAN BY ID
router.delete('/:planId', async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({
      _id: req.params.planId,
      userId: getCurrentUserId(req),
    });
    if (!plan) return res.status(404).json({ error: "Plan not found" });
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete plan" });
  }
});

// 2. SAVE A PLAN TO THE VAULT
router.post('/save', async (req, res) => {
  try {
    const { formData, aiResponse } = req.body;
    const newPlan = await Plan.create({
      userId: getCurrentUserId(req),
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
    const formData = { ...req.body };
    delete formData.userId;
    const aiRawText = await generatePlan(formData);

    if (!aiRawText) return res.status(500).json({ error: "Generation failed" });

    // Save to DB immediately if userId is provided
    await Plan.create({
      userId: getCurrentUserId(req),
      formData,
      aiResponse: aiRawText
    });
    console.log("✅ Plan auto-saved to history");

    res.json(JSON.parse(aiRawText));
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate or save plan" });
  }
});

// 4. ADJUST EXISTING PLAN
router.post('/adjust-plan', async (req, res) => {
  try {
    const { currentPlan, adjustmentRequest, formData } = req.body;

    const prompt = `
      Current Plan: ${JSON.stringify(currentPlan)}
      Adjustment: "${adjustmentRequest}"
      Respond in exact JSON format.
    `;

    const updatedRawText = await generatePlan(prompt);
    
    if (!updatedRawText) return res.status(500).json({ error: "Adjustment failed" });

    // Save the adjusted version as a new entry in history
    await Plan.create({
      userId: getCurrentUserId(req),
      formData,
      aiResponse: updatedRawText
    });

    res.json(JSON.parse(updatedRawText));
  } catch (error: any) {
    res.status(500).json({ error: "Failed to adjust plan" });
  }
});

export default router;