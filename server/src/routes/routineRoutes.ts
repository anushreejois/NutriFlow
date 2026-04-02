import express from 'express';
import User from '../models/User';
import DailyLog from '../models/DailyLog';

const router = express.Router();

// 1. UPDATE GYM SPLIT
router.put('/split', async (req, res) => {
  try {
    const { userId, gymRoutine } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.gymRoutine = gymRoutine;
    await user.save();
    res.json(user.gymRoutine);
  } catch (error) {
    res.status(500).json({ error: 'Server error saving split' });
  }
});

// 2. SAVE DAILY LOG & RUN DUOLINGO STREAK ENGINE
router.post('/log', async (req, res) => {
  try {
    const { userId, date, mealStatus, gymCompleted } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // --- 50 DAY FREEZER RESET CHECK ---
    const today = new Date();
    if (!user.lastFreezeResetDate) user.lastFreezeResetDate = today;
    
    // Calculate days since last freezer restock
    const daysSinceReset = Math.floor((today.getTime() - new Date(user.lastFreezeResetDate).getTime()) / (1000 * 3600 * 24));
    
    if (daysSinceReset >= 50) {
        user.availableFreezes = 3; // Restock!
        user.lastFreezeResetDate = today; // Reset the clock
    }

    // --- SAVE THE ACTUAL LOG ---
    let log = await DailyLog.findOne({ userId, date });
    if (log) {
      log.mealStatus = mealStatus;
      log.gymCompleted = gymCompleted;
      await log.save();
    } else {
      log = new DailyLog({ userId, date, mealStatus, gymCompleted });
      await log.save();
    }

    // --- THE STREAK & FREEZER ALGORITHM ---
    // Fetch all logs and sort them chronologically to calculate the chain
    const allLogs = await DailyLog.find({ userId }).sort({ date: 1 });
    const successfulLogs = allLogs.filter(l => l.mealStatus === 'perfect' || l.mealStatus === 'modified');

    let currentStreak = 0;
    let longestStreak = 0;
    let activeFreezes = user.availableFreezes !== undefined ? user.availableFreezes : 3;

    if (successfulLogs.length > 0) {
        currentStreak = 1;
        longestStreak = 1;

        // Loop through history and check the gaps
        for (let i = 1; i < successfulLogs.length; i++) {
            const prev = new Date(successfulLogs[i-1].date);
            const curr = new Date(successfulLogs[i].date);
            const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));

            if (diffDays === 1) {
                // Perfect consecutive day
                currentStreak++;
            } else if (diffDays > 1) {
                // Uh oh, a gap!
                const missedDays = diffDays - 1;
                if (activeFreezes >= missedDays) {
                    // STREAK SAVED BY FREEZE! Consume the freezes and continue.
                    activeFreezes -= missedDays;
                    currentStreak++; 
                } else {
                    // Not enough freezes. Streak breaks. Start over from 1.
                    currentStreak = 1;
                }
            }

            if (currentStreak > longestStreak) longestStreak = currentStreak;
        }

        // Final check: Did they miss days leading up to TODAY?
        const lastLogDate = new Date(successfulLogs[successfulLogs.length - 1].date);
        const todayNormalized = new Date(today.toISOString().split('T')[0]);
        const daysSinceLastLog = Math.round((todayNormalized.getTime() - lastLogDate.getTime()) / (1000 * 3600 * 24));

        if (daysSinceLastLog > 1) {
            const missedToToday = daysSinceLastLog - 1;
            if (activeFreezes < missedToToday) {
                currentStreak = 0; // Streak officially dead today
            }
        }
    }

    // Save the math to the user
    user.currentStreak = currentStreak;
    user.longestStreak = Math.max(user.longestStreak, longestStreak);
    user.availableFreezes = activeFreezes;
    await user.save();

    res.json({
        log,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        availableFreezes: user.availableFreezes
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error saving log' });
  }
});

// 3. GET TODAY'S LOG (So it stays when you refresh the page)
router.get('/log/:userId/:date', async (req, res) => {
  try {
    const log = await DailyLog.findOne({ userId: req.params.userId, date: req.params.date });
    res.json(log || { mealStatus: "none", gymCompleted: false });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching log' });
  }
});

// 4. GET WEEKLY SUMMARY (Calculates real stats!)
router.get('/summary/:userId/:startDate/:endDate', async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch all logs between Monday and Sunday
    const logs = await DailyLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    let workoutsCrushed = 0;
    let goodMeals = 0;
    let cheatMeals = 0;
    const missedWorkouts: string[] = [];
    
    // Calculate expected workouts based on their split (Anything that isn't "Rest")
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    let workoutsTarget = 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // Loop through every day of the week to see what happened
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayName = days[d.getDay()];
        const expectedWorkout = user.gymRoutine[dayName as keyof typeof user.gymRoutine];
        const isRestDay = expectedWorkout.toLowerCase() === 'rest';

        if (!isRestDay) workoutsTarget++;

        const log = logs.find(l => l.date === dateStr);

        if (log) {
            if (log.gymCompleted) workoutsCrushed++;
            else if (!isRestDay && d < today) missedWorkouts.push(expectedWorkout); // Missed a past workout!

            if (log.mealStatus === 'perfect' || log.mealStatus === 'modified') goodMeals++;
            else if (log.mealStatus === 'cheat_day') cheatMeals++;
        } else {
            // No log exists for this day yet
            if (!isRestDay && d < today) missedWorkouts.push(expectedWorkout);
        }
    }

    // Math for the final grades
    const totalLoggedMeals = goodMeals + cheatMeals;
    const nutritionCompliance = totalLoggedMeals > 0 ? Math.round((goodMeals / totalLoggedMeals) * 100) : 0;

    const areasToImprove: string[] = [];
    if (missedWorkouts.length > 0) {
        const uniqueMissed = [...new Set(missedWorkouts)];
        areasToImprove.push(`Missed: ${uniqueMissed.slice(0, 2).join(', ')}`);
    }
    if (cheatMeals > 0) areasToImprove.push(`${cheatMeals} Cheat Meal${cheatMeals > 1 ? 's' : ''}`);
    if (areasToImprove.length === 0) areasToImprove.push("Perfect Week! Keep it up.");

    res.json({
        workoutsCrushed,
        workoutsTarget,
        nutritionCompliance,
        areasToImprove
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error fetching summary' });
  }
});

export default router;