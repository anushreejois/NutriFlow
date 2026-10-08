import express from 'express';
import Blog from '../models/Blog';
import User from '../models/User';
import { requireClerkAuth, requireCurrentUser, getCurrentUserId } from '../middleware/auth';

const router = express.Router();

// 1. GET ALL BLOGS (Sorted by newest first)
router.get('/', async (req, res) => {
  try {
    // .sort({ createdAt: -1 }) ensures the newest posts appear at the top!
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching blogs' });
  }
});

// 2. CREATE A NEW BLOG
router.post('/', requireClerkAuth, requireCurrentUser, async (req, res) => {
  try {
    const { title, category, content, excerpt } = req.body;
    const userId = getCurrentUserId(req);
    const user = await User.findById(userId).select('name');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newBlog = new Blog({
      title,
      author: user.name,
      userId,
      category,
      content,
      excerpt,
      likes: 0 // Starts at 0
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog); // 201 means "Created successfully"
  } catch (error) {
    res.status(500).json({ error: 'Server error creating blog' });
  }
});

// 3. OPTIONAL: LIKE A BLOG
router.put('/:id/like', requireClerkAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      blog.likes += 1;
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error liking blog' });
  }
});

export default router;