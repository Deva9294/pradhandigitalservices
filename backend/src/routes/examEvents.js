import { Router } from 'express';
import * as ctrl from '../controllers/examEventController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', ctrl.getAllExamEvents);
router.get('/:slug', ctrl.getExamEvent);

// Protected routes
router.use(protect);

// Admin only routes
router.post('/', protect, ctrl.createExamEvent);
router.put('/:id', protect, ctrl.updateExamEvent);
router.delete('/:id', protect, ctrl.deleteExamEvent);

export default router;