import { Router } from 'express';
import healthController from '../controllers/healthController';
import authRouter from './auth';

const router = Router();

// Health check endpoint
router.get('/health', healthController.getHealth);

// Auth routes
router.use('/auth', authRouter);

export default router;