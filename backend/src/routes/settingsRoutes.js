import { cacheMiddleware, clearCache } from '../middleware/cacheMiddleware.js';
import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', cacheMiddleware(300), getSettings);
router.put('/', requireAuth, clearCache('/api/settings'), updateSettings);

export default router;
