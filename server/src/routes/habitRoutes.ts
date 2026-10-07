import express from 'express';
import Habit from '../models/Habit';
import { getCurrentUserId } from '../middleware/auth';

const router = express.Router();

// @desc    Get habits for today
router.get('/:userId', async (req, res) => {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  try {
    let habit = await Habit.findOne({ userId: getCurrentUserId(req), date: today });
    
    // If no record for today, return an empty structure (don't create yet)
    if (!habit) {
      return res.json({ waterIntake: 0, customHabits: [] });
    }
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: "Error fetching habits" });
  }
});

// @desc    Update or Create habits for today
router.post('/update', async (req, res) => {
  const { waterIntake, customHabits } = req.body;
  const today = new Date().toISOString().split('T')[0];

  try {
    const habit = await Habit.findOneAndUpdate(
      { userId: getCurrentUserId(req), date: today },
      { waterIntake, customHabits },
      { upsert: true, new: true } // upsert: true creates it if it doesn't exist
    );
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: "Error saving habits" });
  }
});
router.get('/weekly/:userId', async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  try {
    const history = await Habit.find({
      userId: getCurrentUserId(req),
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    // Format data for the chart (e.g., changing 2023-10-01 to "Mon")
    const chartData = history.map(h => ({
      date: new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' }),
      water: h.waterIntake
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

export default router;