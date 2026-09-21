import { Router } from 'express';
import * as ctrl from '../controllers/schemeController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', ctrl.getAllSchemes);
router.get('/:slug', ctrl.getScheme);

// Protected routes
router.use(protect);

// Admin only routes
router.post('/', protect, ctrl.createScheme);
router.put('/:id', protect, ctrl.updateScheme);
router.delete('/:id', protect, ctrl.deleteScheme);

export default router;