import { cacheMiddleware, clearCache } from '../middleware/cacheMiddleware.js';
import express from 'express';
import { 
  listTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from '../controllers/testimonialController.js';
import { requireAuth, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', cacheMiddleware(300), listTestimonials);
router.post('/', clearCache('/api/testimonials'), requireAuth, verifyAdmin, createTestimonial);
router.put('/:id', clearCache('/api/testimonials'), requireAuth, verifyAdmin, updateTestimonial);
router.delete('/:id', clearCache('/api/testimonials'), requireAuth, verifyAdmin, deleteTestimonial);

export default router;
