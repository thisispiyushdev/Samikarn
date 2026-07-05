import { cacheMiddleware, clearCache } from '../middleware/cacheMiddleware.js';
import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listGallery, createGallery, updateGallery, deleteGallery } from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', cacheMiddleware(300), listGallery);
router.post('/', requireAuth, clearCache('/api/gallery'), createGallery);
router.put('/:id', requireAuth, clearCache('/api/gallery'), updateGallery);
router.delete('/:id', requireAuth, clearCache('/api/gallery'), deleteGallery);

export default router;
