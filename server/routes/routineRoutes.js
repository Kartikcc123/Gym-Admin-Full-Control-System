import express from 'express';
import { getRoutines, createRoutine } from '../controllers/routineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the 'protect' middleware to secure these routes
router.route('/')
  .get(protect, getRoutines)
  .post(protect, createRoutine);

export default router;