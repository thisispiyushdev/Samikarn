import { cacheMiddleware, clearCache } from '../middleware/cacheMiddleware.js';
import express from 'express';
import { 
  listTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from '../controllers/testimonialController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', cacheMiddleware(300), listTestimonials);
router.post('/', clearCache('/api/testimonials'), verifyAdmin, createTestimonial);
router.put('/:id', clearCache('/api/testimonials'), verifyAdmin, updateTestimonial);
router.delete('/:id', clearCache('/api/testimonials'), verifyAdmin, deleteTestimonial);

export default router;
