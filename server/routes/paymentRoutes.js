import express from 'express';
import {
  getPayments,
  recordPayment,
  checkout,
  verifyPayment,
  razorpayWebhook,
  getPendingPayments
} from '../controllers/paymentController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/* =========================================
   1️⃣ GET ALL PAYMENTS + CREATE MANUAL
========================================= */
router
  .route('/')
  .get(protect, getPayments)       // ?status=Pending|Completed optional filter
  .post(protect, recordPayment);   // Manual / Partial Payment


/* =========================================
   2️⃣ CREATE RAZORPAY ORDER
========================================= */
router.post('/checkout', protect, checkout);


/* =========================================
   3️⃣ VERIFY PAYMENT (Signature Validation)
========================================= */
router.post('/verify', protect, verifyPayment);


/* =========================================
   4️⃣ GET PENDING DUES (Aggregated)
========================================= */
router.get('/pending', protect, getPendingPayments);


/* =========================================
   5️⃣ RAZORPAY WEBHOOK (MUST BE RAW BODY)
   ⚠️ DO NOT USE express.json() HERE
========================================= */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  razorpayWebhook
);

export default router;