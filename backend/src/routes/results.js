import { Router } from 'express';
import * as ctrl from '../controllers/resultController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', ctrl.getAllResults);
router.get('/:slug', ctrl.getResult);

// Protected routes
router.use(protect);

// Admin only routes
router.post('/', protect, ctrl.createResult);
router.put('/:id', protect, ctrl.updateResult);
router.delete('/:id', protect, ctrl.deleteResult);

export default router;