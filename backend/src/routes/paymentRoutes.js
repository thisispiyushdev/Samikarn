import express from 'express';
import { createOrder, verifyPayment, getRazorpayKey, getDonations } from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/order', createOrder);
router.post('/verify', verifyPayment);
router.get('/key', getRazorpayKey);
router.get('/donations', requireAuth, getDonations);

export default router;
