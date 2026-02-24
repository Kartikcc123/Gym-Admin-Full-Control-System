import express from 'express';
import { getDashboardData } from '../controllers/dashboardCtrl.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Get aggregate data for the Admin Dashboard
// @access  Private (Admin)
router.route('/')
  .get(protect, adminOnly, getDashboardData);

export default router;