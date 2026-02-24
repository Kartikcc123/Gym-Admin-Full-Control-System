import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
// Inside routes/dietWorkoutRoutes.js
import { updateMemberPlans, getMemberPlans } from '../controllers/dietWorkoutController.js';

const router = express.Router();

// Route to get a member's plan (Viewable by the logged-in member or their trainer)
router.route('/:memberId')
  .get(protect, getMemberPlans)
  .put(protect, updateMemberPlans); // Trainer/Admin updates the plan

export default router;