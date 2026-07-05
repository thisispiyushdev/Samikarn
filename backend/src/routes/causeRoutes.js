import { cacheMiddleware, clearCache } from '../middleware/cacheMiddleware.js';
import express from 'express';
import { listCauses, createCause, updateCause, deleteCause } from '../controllers/causeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', cacheMiddleware(300), listCauses);
router.post('/', requireAuth, clearCache('/api/causes'), createCause);
router.put('/:id', requireAuth, clearCache('/api/causes'), updateCause);
router.delete('/:id', requireAuth, clearCache('/api/causes'), deleteCause);

export default router;
