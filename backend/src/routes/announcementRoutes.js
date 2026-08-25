import { cacheMiddleware, clearCache } from '../middleware/cacheMiddleware.js';
import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';

const router = express.Router();

router.get('/', cacheMiddleware(300), listAnnouncements);
router.get('/:id', getAnnouncement);
router.post('/', requireAuth, clearCache('/api/announcements'), createAnnouncement);
router.put('/:id', requireAuth, clearCache('/api/announcements'), updateAnnouncement);
router.delete('/:id', requireAuth, clearCache('/api/announcements'), deleteAnnouncement);

export default router;
