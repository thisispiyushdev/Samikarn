import { cacheMiddleware, clearCache } from '../middleware/cacheMiddleware.js';
import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/projectController.js';

const router = express.Router();

router.get('/', cacheMiddleware(300), listProjects);
router.get('/:id', getProject);
router.post('/', requireAuth, clearCache('/api/projects'), createProject);
router.put('/:id', requireAuth, clearCache('/api/projects'), updateProject);
router.delete('/:id', requireAuth, clearCache('/api/projects'), deleteProject);

export default router;
