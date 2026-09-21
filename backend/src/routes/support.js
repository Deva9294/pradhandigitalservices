import { Router } from 'express';
import * as ctrl from '../controllers/supportController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(protect);

// Create support ticket
router.post('/', ctrl.createTicket);

// Get my tickets
router.get('/my', ctrl.getMyTickets);

// Get single ticket
router.get('/:id', ctrl.getTicket);

// Add message to ticket
router.post('/:id/messages', ctrl.addMessage);

// Update ticket status (admin/agent only)
router.patch('/:id/status', ctrl.updateStatus);

// Rate ticket
router.patch('/:id/rate', ctrl.rateTicket);

export default router;