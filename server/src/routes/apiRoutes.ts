import express from 'express';
import aiRoutes from './aiRoutes';
import userRoutes from './userRoutes';
import habitRoutes from './habitRoutes';
import blogRoutes from './blogRoutes';
import routineRoutes from './routineRoutes';
import nutriBotRoutes from './ai';

const router = express.Router();

router.use('/nutriflow/v1/plans', aiRoutes);
router.use('/nutriflow/v1/nutri-bot', nutriBotRoutes);
router.use('/nutriflow/v1/users', userRoutes);
router.use('/nutriflow/v1/habits', habitRoutes);
router.use('/nutriflow/v1/blogs', blogRoutes);
router.use('/nutriflow/v1/routines', routineRoutes);

router.use('/plans', aiRoutes);
router.use('/bot', nutriBotRoutes);
router.use('/user', userRoutes);
router.use('/users', userRoutes);
router.use('/habits', habitRoutes);
router.use('/blogs', blogRoutes);
router.use('/routine', routineRoutes);

export default router;
