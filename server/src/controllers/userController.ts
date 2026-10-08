import { Request, Response } from 'express';
import { clerkClient } from '@clerk/express';
import User from '../models/User';
import { getCurrentUserId } from '../middleware/auth';

// @desc    Update 21-Day Reset Progress
// @route   PUT /api/nutriflow/v1/users/reset-progress
export const updateResetProgress = async (req: Request, res: Response) => {
  try {
    const { dayNumber } = req.body;
    const user = await User.findById(getCurrentUserId(req));

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
// @route   GET /api/nutriflow/v1/users/profile/:id
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getCurrentUserId(req)).select('-password');
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
// @route   PUT /api/nutriflow/v1/users/cycle-data
export const updateCycleData = async (req: Request, res: Response) => {
  try {
    const { date, length } = req.body;
    const user = await User.findById(getCurrentUserId(req));

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
// @route   PUT /api/nutriflow/v1/users/profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // --- ADDED GENDER, DIETARY, AND NEW TRACKING FIELDS HERE ---
    const {
      age,
      weight,
      height,
      dietaryPreference,
      goal,
      activityLevel,
      gender,
      dietary,
      gymRoutine,
    } = req.body;
    
    const user = await User.findById(getCurrentUserId(req));

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
// @route   POST /api/nutriflow/v1/users/sync
export const syncClerkUser = async (req: Request, res: Response) => {
  try {
    const clerkId = req.authenticatedClerkId;
    if (!clerkId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const clerkUser = await clerkClient.users.getUser(clerkId);
    const primaryEmail = clerkUser.emailAddresses.find(
      ({ id }) => id === clerkUser.primaryEmailAddressId,
    );
    if (!primaryEmail || primaryEmail.verification?.status !== 'verified') {
      return res.status(403).json({ message: 'A verified email address is required.' });
    }

    const email = primaryEmail.emailAddress.toLowerCase();
    const name = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(' ')
      .trim() || email.split('@')[0];

    let user = await User.findOne({ clerkId }).select('-password');
    if (!user) {
      user = await User.findOne({ email });
      if (user?.clerkId && user.clerkId !== clerkId) {
        return res.status(409).json({ message: 'This account is already linked to another identity.' });
      }

      if (user) {
        user.clerkId = clerkId;
        user.name = name;
        await user.save();
      } else {
        user = await User.create({ clerkId, email, name });
      }
    } else if (user.name !== name || user.email !== email) {
      user.name = name;
      user.email = email;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Failed to sync authenticated Clerk user:', error);
    res.status(500).json({ message: 'Server Error syncing user' });
  }
};