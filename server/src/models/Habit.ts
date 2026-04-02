import mongoose, { Schema, Document } from 'mongoose';

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  waterIntake: number; // Number of glasses
  customHabits: { name: string; completed: boolean }[];
  date: string; // We'll store as YYYY-MM-DD to reset every day
}

const habitSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  waterIntake: { type: Number, default: 0 },
  customHabits: [{ name: String, completed: { type: Boolean, default: false } }],
  date: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IHabit>('Habit', habitSchema);