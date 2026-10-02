import express from 'express';
import rateLimit from 'express-rate-limit';
import { createOrder, verifyPayment, getRazorpayKey, getDonations, recordPaymentFailure } from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limiting for payment endpoints (allow more attempts during development and testing)
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 30 : 200, // Limit each IP to 30 in prod, 200 in dev
  message: { success: false, message: 'Too many payment requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post('/order', paymentLimiter, createOrder);
router.post('/verify', paymentLimiter, verifyPayment);
router.post('/failure', paymentLimiter, recordPaymentFailure);
router.get('/key', getRazorpayKey);
router.get('/donations', requireAuth, getDonations);

export default router;
