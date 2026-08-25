import express from 'express';
import { submitContactForm, getContacts } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContactForm);
router.get('/', requireAuth, getContacts);

export default router;
