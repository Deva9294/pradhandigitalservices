import { Router } from 'express';
import * as ctrl from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public routes (webhooks)
router.post('/webhook/razorpay', ctrl.razorpayWebhook);

// Protected routes
router.use(protect);

// Create payment order
router.post('/create-order', ctrl.createOrder);

// Verify payment
router.post('/verify', ctrl.verifyPayment);

// Get payment status
router.get('/:id', ctrl.getPayment);

// Get my payments
router.get('/my', ctrl.getMyPayments);

// Process refund (admin only)
router.post('/:id/refund', ctrl.processRefund);

export default router;