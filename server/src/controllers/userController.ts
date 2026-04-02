import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Update 21-Day Reset Progress
// @route   PUT /api/user/reset-progress
export const updateResetProgress = async (req: Request, res: Response) => {
  try {
    const { userId, dayNumber } = req.body; 

    const user = await User.findById(userId);

    if (user) {
      if (!user.resetDaysCompleted.includes(dayNumber)) {
        user.resetDaysCompleted.push(dayNumber);
        
        if (user.resetStartDate === null) {
          user.resetStartDate = new Date();
        }
        
        await user.save();
      }

      res.json({ 
        resetDaysCompleted: user.resetDaysCompleted,
        resetStartDate: user.resetStartDate 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get User Profile (to load progress on login)
// @route   GET /api/user/profile/:id
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); 
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update Cycle Data
// @route   PUT /api/user/cycle-data
export const updateCycleData = async (req: Request, res: Response) => {
  try {
    const { userId, date, length } = req.body; 

    const user = await User.findById(userId);

    if (user) {
      if (date) user.lastPeriodDate = date;
      if (length) user.cycleLength = length;
      
      await user.save();

      res.json({ 
        lastPeriodDate: user.lastPeriodDate, 
        cycleLength: user.cycleLength 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update User Profile (Physical Stats)
// @route   PUT /api/user/profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // --- ADDED GENDER, DIETARY, AND NEW TRACKING FIELDS HERE ---
    const { 
      userId, age, weight, height, dietaryPreference, goal, activityLevel, 
      gender, dietary, gymRoutine 
    } = req.body;
    
    const user = await User.findById(userId);

    if (user) {
      user.age = age || user.age;
      user.weight = weight || user.weight;
      user.height = height || user.height;
      user.dietaryPreference = dietaryPreference || user.dietaryPreference;
      user.goal = goal || user.goal;
      user.activityLevel = activityLevel || user.activityLevel;
      
      // --- SAVING THE NEW FIELDS TO THE DATABASE ---
      user.gender = gender || user.gender;
      user.dietary = dietary || user.dietary;
      if (gymRoutine) user.gymRoutine = gymRoutine;

      const updatedUser = await user.save();
      
      // --- SENDING IT ALL BACK TO THE FRONTEND ---
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        age: updatedUser.age,
        weight: updatedUser.weight,
        height: updatedUser.height,
        dietaryPreference: updatedUser.dietaryPreference,
        goal: updatedUser.goal,
        activityLevel: updatedUser.activityLevel,
        gender: updatedUser.gender,
        dietary: updatedUser.dietary,
        gymRoutine: updatedUser.gymRoutine,
        currentStreak: updatedUser.currentStreak,
        longestStreak: updatedUser.longestStreak
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating profile' });
  }
};

// @desc    Sync Clerk User to MongoDB
// @route   POST /api/users/sync
export const syncClerkUser = async (req: Request, res: Response) => {
  try {
    const { clerkId, email, name } = req.body;
    
    // 1. Check if user already exists by their Clerk ID
    let user = await User.findOne({ clerkId });

    if (!user) {
      // 2. If no Clerk ID, check if they exist from the old email/password system
      user = await User.findOne({ email });
      
      if (user) {
        // Link their old account to their new Clerk account
        user.clerkId = clerkId;
        await user.save();
      } else {
        // 3. Completely new user! Create a fresh profile.
        user = await User.create({ clerkId, email, name });
      }
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error syncing user' });
  }
};