import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listGallery, createGallery, updateGallery, deleteGallery } from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', listGallery);
router.post('/', requireAuth, createGallery);
router.put('/:id', requireAuth, updateGallery);
router.delete('/:id', requireAuth, deleteGallery);

export default router;
