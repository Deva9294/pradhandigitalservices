import { Router } from 'express';
import * as ctrl from '../controllers/admitCardController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', ctrl.getAllAdmitCards);
router.get('/:slug', ctrl.getAdmitCard);

// Protected routes
router.use(protect);

// Admin only routes
router.post('/', protect, ctrl.createAdmitCard);
router.put('/:id', protect, ctrl.updateAdmitCard);
router.delete('/:id', protect, ctrl.deleteAdmitCard);

export default router;