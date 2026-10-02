import express from 'express';
import { submitContactForm, getContacts, addTestContact, testSubmitFromBrowser } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContactForm);
router.post('/test-cron', addTestContact);
router.get('/test-submit', testSubmitFromBrowser);
router.get('/', requireAuth, getContacts);

export default router;
