import express from 'express';
import { 
  updateResetProgress, 
  getUserProfile, 
  updateCycleData, 
  updateUserProfile,
  syncClerkUser 
} from '../controllers/userController';

const router = express.Router();

// --- TRACKER ROUTES ---
router.put('/reset-progress', updateResetProgress);
router.put('/cycle-data', updateCycleData);

// --- PROFILE ROUTES ---
router.get('/profile/:id', getUserProfile);
router.put('/profile', updateUserProfile);

// --- CLERK SYNC ROUTE ---
router.post('/sync', syncClerkUser);

export default router;