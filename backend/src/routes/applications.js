import { Router } from 'express';
import * as ctrl from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = Router();

// Public route - Track application
router.get('/track/:applicationId', ctrl.trackApplication);

// All remaining routes require authentication
router.use(protect);

// Create application
router.post('/', ctrl.createApplication);

// Get my applications
router.get('/my', ctrl.getMyApplications);

// Get single application
router.get('/:id', ctrl.getApplication);

// Update application
router.put('/:id', ctrl.updateApplication);

// Upload document
router.post('/:id/documents', ctrl.uploadDocument);

// Delete document
router.delete('/:id/documents/:documentId', ctrl.deleteDocument);

// Update status (admin/agent only)
router.patch('/:id/status', ctrl.updateStatus);

// Add remarks
router.patch('/:id/remarks', ctrl.addRemarks);

export default router;