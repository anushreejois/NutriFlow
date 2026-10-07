import express from 'express';
import aiRoutes from './aiRoutes';
import userRoutes from './userRoutes';
import habitRoutes from './habitRoutes';
import blogRoutes from './blogRoutes';
import routineRoutes from './routineRoutes';
import { requireClerkAuth, requireCurrentUser, requireOwnUser } from '../middleware/auth';
import nutriBotRoutes from './ai';

const router = express.Router();

const requireUserAccess = [requireClerkAuth, requireCurrentUser, requireOwnUser];

router.use('/nutriflow/v1/plans', ...requireUserAccess, aiRoutes);
router.use('/nutriflow/v1/nutri-bot', requireClerkAuth, nutriBotRoutes);
router.use('/nutriflow/v1/users', userRoutes);
router.use('/nutriflow/v1/habits', ...requireUserAccess, habitRoutes);
router.use('/nutriflow/v1/blogs', blogRoutes);
router.use('/nutriflow/v1/routines', ...requireUserAccess, routineRoutes);

router.use('/plans', ...requireUserAccess, aiRoutes);
router.use('/bot', requireClerkAuth, nutriBotRoutes);
router.use('/user', userRoutes);
router.use('/users', userRoutes);
router.use('/habits', ...requireUserAccess, habitRoutes);
router.use('/blogs', blogRoutes);
router.use('/routine', ...requireUserAccess, routineRoutes);

export default router;
