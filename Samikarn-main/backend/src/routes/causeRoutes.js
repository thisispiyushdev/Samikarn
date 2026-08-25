import express from 'express';
import { listCauses, createCause, updateCause, deleteCause } from '../controllers/causeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', listCauses);
router.post('/', requireAuth, createCause);
router.put('/:id', requireAuth, updateCause);
router.delete('/:id', requireAuth, deleteCause);

export default router;
