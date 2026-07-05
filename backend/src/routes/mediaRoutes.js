import { cacheMiddleware, clearCache } from '../middleware/cacheMiddleware.js';
import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listMedia, createMedia, updateMedia, deleteMedia } from '../controllers/mediaController.js';

const router = express.Router();

router.get('/', cacheMiddleware(300), listMedia);
router.post('/', requireAuth, clearCache('/api/media'), createMedia);
router.put('/:id', requireAuth, clearCache('/api/media'), updateMedia);
router.delete('/:id', requireAuth, clearCache('/api/media'), deleteMedia);

export default router;
