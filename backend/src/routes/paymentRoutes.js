import express from 'express';
import rateLimit from 'express-rate-limit';
import { createOrder, verifyPayment, getRazorpayKey, getDonations, recordPaymentFailure } from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limiting for payment endpoints (e.g., max 5 requests per 15 minutes)
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 payment requests per windowMs
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
