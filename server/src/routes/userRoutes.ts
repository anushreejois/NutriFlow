import express from 'express';
import { requireClerkAuth, requireCurrentUser, requireOwnUser } from '../middleware/auth';
import { 
  updateResetProgress, 
  getUserProfile, 
  updateCycleData, 
  updateUserProfile,
  syncClerkUser 
} from '../controllers/userController';

const router = express.Router();

// Clerk identity is sufficient to create or link the caller's application profile.
router.post('/sync', requireClerkAuth, syncClerkUser);

router.use(requireClerkAuth, requireCurrentUser, requireOwnUser);

// --- TRACKER ROUTES ---
router.put('/reset-progress', updateResetProgress);
router.put('/cycle-data', updateCycleData);

// --- PROFILE ROUTES ---
router.get('/profile/:id', getUserProfile);
router.put('/profile', updateUserProfile);

export default router;