import express from 'express';
import { getPlans, createPlan } from '../controllers/planController.js';
import { protect } from '../middleware/authMiddleware.js'; // Protects the route using your JWT

const router = express.Router();

// Both GET (fetch) and POST (create) hit the root '/' of this router
router.route('/')
  .get(protect, getPlans)
  .post(protect, createPlan);

export default router;