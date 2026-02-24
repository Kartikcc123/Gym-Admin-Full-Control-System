import express from 'express';
// FIX: Changed 'getMemberAttendance' to 'getTodayAttendance' to match the controller
import { markAttendance, getTodayAttendance } from '../controllers/attendanceController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/mark', protect, adminOnly, markAttendance);
router.get('/today', protect, adminOnly, getTodayAttendance);

export default router;