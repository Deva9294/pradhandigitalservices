import { Router } from 'express';
import * as ctrl from '../controllers/documentToolController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(protect);

// Document processing endpoints
router.post('/jpg-to-pdf', protect, ctrl.jpgToPdf);
router.post('/pdf-merge', protect, ctrl.pdfMerge);
router.post('/pdf-split', protect, ctrl.pdfSplit);
router.post('/compress-pdf', protect, ctrl.compressPdf);
router.post('/resize-photo', protect, ctrl.resizePhoto);
router.post('/remove-background', protect, ctrl.removeBackground);
router.post('/crop-signature', protect, ctrl.cropSignature);
router.post('/compress-image', protect, ctrl.compressImage);

export default router;