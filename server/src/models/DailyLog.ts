import mongoose, { Document, Schema } from 'mongoose';

export interface IDailyLog extends Document {
  userId: string;
  date: string; // Stored as "YYYY-MM-DD"
  mealStatus: 'perfect' | 'modified' | 'cheat_day' | 'none';
  gymCompleted: boolean;
  notes: string;
}

const dailyLogSchema = new Schema<IDailyLog>({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  mealStatus: { type: String, enum: ['perfect', 'modified', 'cheat_day', 'none'], default: 'none' },
  gymCompleted: { type: Boolean, default: false },
  notes: { type: String, default: "" }
}, {
  timestamps: true,
});

const DailyLog = mongoose.model<IDailyLog>('DailyLog', dailyLogSchema);

export default DailyLog;