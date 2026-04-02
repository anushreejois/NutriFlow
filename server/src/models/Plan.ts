import mongoose, { Document, Schema } from 'mongoose';

export interface IPlan extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  formData: object;      // What they told the AI (Age, Weight, etc.)
  aiResponse: string;    // What the AI gave back
}

const planSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  formData: { type: Object, required: true },
  aiResponse: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IPlan>('Plan', planSchema);