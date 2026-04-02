import mongoose, { Document } from 'mongoose';

// 1. The Interface (Tells TypeScript what a User looks like)
export interface IUser extends Document {
  clerkId: string; // <--- NEW: Clerk ID linking
  name: string;
  email: string;
  password?: string; // <--- Made optional! Clerk handles this now.
  
  // Reset Program Tracking
  resetStartDate: Date | null;
  resetDaysCompleted: number[];
  
  // Cycle Tracking
  lastPeriodDate: Date | null;
  cycleLength: number;
  
  // Physical Profile Data
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;  
  dietary?: string; 
  dietaryPreference?: string; 
  goal?: string;
  activityLevel?: string;

  // Streaks & Gym Routine
  currentStreak: number;
  longestStreak: number;
  availableFreezes: number;
  lastFreezeResetDate: Date;
  gymRoutine: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

// 2. The Schema (Tells MongoDB how to save the User)
const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, sparse: true }, // <--- NEW: Allows linking
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // <--- Changed to false!
  
  // --- TRACKING DATA ---
  resetStartDate: { type: Date, default: null },
  resetDaysCompleted: { type: [Number], default: [] },
  lastPeriodDate: { type: Date, default: null },
  cycleLength: { type: Number, default: 28 },

  // --- PHYSICAL PROFILE DATA ---
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number },
  gender: { type: String, default: 'female' },
  dietary: { type: String, default: 'standard' },
  dietaryPreference: { type: String, default: 'none' },
  goal: { type: String, default: 'maintain' },
  activityLevel: { type: String, default: 'moderate' },

  // --- STREAKS & GYM DEFAULTS ---
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  availableFreezes: { type: Number, default: 3 },
  lastFreezeResetDate: { type: Date, default: Date.now },
  gymRoutine: {
    monday: { type: String, default: 'Chest & Triceps' },
    tuesday: { type: String, default: 'Back & Biceps' },
    wednesday: { type: String, default: 'Active Recovery' },
    thursday: { type: String, default: 'Legs & Core' },
    friday: { type: String, default: 'Shoulders & Arms' },
    saturday: { type: String, default: 'Cardio / Flexibility' },
    sunday: { type: String, default: 'Rest' }
  }
}, { timestamps: true });

// 3. Export the Model
export default mongoose.model<IUser>('User', userSchema);