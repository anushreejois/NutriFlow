import mongoose, { Document, Schema } from 'mongoose';

// 1. The TypeScript Interface
export interface IBlog extends Document {
  title: string;
  author: string;     // The name of the person who wrote it
  userId?: string;    // (Optional) To link it to a specific user's account later
  category: string;
  content: string;    // The full story
  excerpt: string;    // A short preview for the cards
  likes: number;
}

// 2. The Mongoose Schema
const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  author: { type: String, required: true, default: "Anonymous" },
  userId: { type: String }, // Can be used later to let users delete their own posts
  category: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  likes: { type: Number, default: 0 } // Starts at 0 likes
}, {
  timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' dates!
});

const Blog = mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;