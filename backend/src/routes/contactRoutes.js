import express from 'express';
import { submitContactForm, getContacts, addTestContact } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContactForm);
router.post('/test-cron', addTestContact);
router.get('/', requireAuth, getContacts);

export default router;
