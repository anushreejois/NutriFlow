import express from 'express';
import { generatePlan } from '../services/gemini';
import Plan from '../models/Plan';
import { getCurrentUserId } from '../middleware/auth';
import {
  NutritionPlan,
  parseNutritionPlan,
  parseWellnessProfile,
  PlanValidationError,
  WellnessProfile,
} from '../services/planValidation';

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
    const formData = parseWellnessProfile(req.body?.formData);
    const aiResponse = parseNutritionPlan(req.body?.aiResponse);
    const newPlan = await Plan.create({
      userId: getCurrentUserId(req),
      formData,
      aiResponse: JSON.stringify(aiResponse),
      date: new Date()
    });
    res.status(201).json(newPlan);
  } catch (error) {
    if (error instanceof PlanValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error("Failed to save validated plan:", error);
    res.status(500).json({ error: "Failed to save plan to database" });
  }
});

// 3. GENERATE INITIAL PLAN
router.post('/generate-plan', async (req, res) => {
  let formData: WellnessProfile;
  try {
    const submittedData = { ...req.body };
    delete submittedData.userId;
    formData = parseWellnessProfile(submittedData);
  } catch (error) {
    if (error instanceof PlanValidationError) {
      return res.status(400).json({ error: error.message });
    }
    throw error;
  }

  let plan: NutritionPlan;
  try {
    plan = await generatePlan(formData);
  } catch (error) {
    console.error("AI plan generation failed validation or provider request:", error);
    return res.status(502).json({ error: "A safe, complete plan could not be generated. Please try again." });
  }

  try {
    await Plan.create({
      userId: getCurrentUserId(req),
      formData,
      aiResponse: JSON.stringify(plan)
    });
    return res.json(plan);
  } catch (error) {
    console.error("Failed to save generated plan:", error);
    return res.status(500).json({ error: "The plan was generated but could not be saved." });
  }
});

// 4. ADJUST EXISTING PLAN
router.post('/adjust-plan', async (req, res) => {
  let formData: WellnessProfile;
  let currentPlan: NutritionPlan;
  let adjustmentRequest: string;
  try {
    formData = parseWellnessProfile(req.body?.formData);
    currentPlan = parseNutritionPlan(req.body?.currentPlan);
    if (typeof req.body?.adjustmentRequest !== "string") {
      throw new PlanValidationError("adjustmentRequest must be a string.");
    }
    adjustmentRequest = req.body.adjustmentRequest.trim();
    if (!adjustmentRequest || adjustmentRequest.length > 500) {
      throw new PlanValidationError("adjustmentRequest must be between 1 and 500 characters.");
    }
  } catch (error) {
    if (error instanceof PlanValidationError) {
      return res.status(400).json({ error: error.message });
    }
    throw error;
  }

  let plan: NutritionPlan;
  try {
    plan = await generatePlan(formData, { currentPlan, request: adjustmentRequest });
  } catch (error) {
    console.error("AI plan adjustment failed validation or provider request:", error);
    return res.status(502).json({ error: "A safe, complete plan could not be generated. Please try again." });
  }

  try {
    await Plan.create({
      userId: getCurrentUserId(req),
      formData,
      aiResponse: JSON.stringify(plan)
    });
    return res.json(plan);
  } catch (error) {
    console.error("Failed to save adjusted plan:", error);
    return res.status(500).json({ error: "The adjusted plan was generated but could not be saved." });
  }
});

export default router;