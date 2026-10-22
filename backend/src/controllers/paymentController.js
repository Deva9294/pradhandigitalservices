import crypto from 'crypto';
import Payment from '../models/Payment.js';
import ServiceApplication from '../models/ServiceApplication.js';
import PaymentAdapterFactory from '../services/paymentAdapter.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const createOrder = catchAsync(async (req, res) => {
  const { amount, currency = 'INR', gateway = 'razorpay', type, applicationId } = req.body;

  if (!amount || amount <= 0) {
    throw new AppError('Invalid amount', 400);
  }

  // Get or create payment record
  let payment;
  if (applicationId) {
    const application = await ServiceApplication.findById(applicationId);
    if (!application) throw new AppError('Application not found', 404);

    payment = await Payment.findOne({ application: applicationId });
    if (payment && payment.status === 'completed') {
      throw new AppError('Payment already completed', 400);
    }
  }

  // Generate receipt
  const receipt = `PDS_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // Create payment record
  if (!payment) {
    payment = await Payment.create({
      user: req.user._id,
      application: applicationId,
      type: type || 'service_application',
      amount,
      currency,
      feeBreakdown: {
        governmentFee: amount * 0.8,
        portalFee: amount * 0.2,
        convenienceFee: 0,
        tax: 0,
        total: amount
      },
      gateway,
      gatewayOrderId: receipt,
      status: 'pending',
      initiatedAt: new Date()
    });
  }

  // Use payment adapter to create order
  const adapter = PaymentAdapterFactory.getAdapter(gateway);
  const order = await adapter.createOrder({
    amount,
    currency,
    receipt,
    notes: {
      paymentId: payment.paymentId,
      userId: req.user._id,
      applicationId: applicationId
    }
  });

  // Update payment with gateway order ID
  payment.gatewayOrderId = order.orderId;
  await payment.save();

  res.json({
    success: true,
    data: {
      paymentId: payment.paymentId,
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      ...order
    }
  });
});

export const verifyPayment = catchAsync(async (req, res) => {
  const { paymentId, gateway = 'razorpay', ...paymentData } = req.body;

  const payment = await Payment.findOne({ paymentId });
  if (!payment) throw new AppError('Payment not found', 404);

  if (payment.status === 'completed') {
    throw new AppError('Payment already verified', 400);
  }

  // Use payment adapter to verify
  const adapter = PaymentAdapterFactory.getAdapter(gateway);
  const verification = await adapter.verifyPayment(paymentData);

  if (!verification.success) {
    throw new AppError('Payment verification failed', 400);
  }

  // Update payment status
  payment.status = 'completed';
  payment.gatewayTransactionId = verification.paymentId;
  payment.verified = true;
  payment.completedAt = new Date();
  payment.verified = true;

  await payment.save();

  // Update application if linked
  if (payment.application) {
    const application = await ServiceApplication.findById(payment.application);
    if (application) {
      application.payment.status = 'completed';
      application.payment.paidAt = new Date();
      application.payment.paymentId = verification.paymentId;
      await application.save();
    }
  }

  res.json({
    success: true,
    data: payment
  });
});

export const getPayment = catchAsync(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('user', 'name email')
    .populate('application');

  if (!payment) throw new AppError('Payment not found', 404);

  // Check authorization
  const isOwner = String(payment.user._id) === String(req.user._id);
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

  if (!isOwner && !isAdmin) {
    throw new AppError('Not authorized', 403);
  }

  res.json({ success: true, data: payment });
});

export const getMyPayments = catchAsync(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const payments = await Payment.find(filter)
    .populate('application', 'applicationId')
    .sort('-createdAt');

  res.json({ success: true, data: payments });
});

export const processRefund = catchAsync(async (req, res) => {
  const { refundAmount, refundReason } = req.body;
  const payment = await Payment.findById(req.params.id);

  if (!payment) throw new AppError('Payment not found', 404);

  if (payment.status !== 'completed') {
    throw new AppError('Can only refund completed payments', 400);
  }

  if (refundAmount > payment.amount) {
    throw new AppError('Refund amount cannot exceed payment amount', 400);
  }

  // Only admin can process refunds
  if (!['admin', 'superadmin'].includes(req.user.role)) {
    throw new AppError('Not authorized', 403);
  }

  // Use payment adapter to process refund
  const adapter = PaymentAdapterFactory.getAdapter(payment.gateway);
  const refund = await adapter.processRefund(
    payment.gatewayTransactionId,
    refundAmount,
    refundReason
  );

  // Update payment status
  payment.status = 'refunded';
  payment.refundAmount = refundAmount;
  payment.refundReason = refundReason;
  payment.refundId = refund.refundId;
  payment.refundedAt = new Date();

  await payment.save();

  res.json({ success: true, data: payment });
});

export const razorpayWebhook = catchAsync(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== signature) {
    throw new AppError('Invalid webhook signature', 400);
  }

  const { event, payload } = req.body;

  if (event === 'payment.captured') {
    const { order_id, payment_id, amount, notes } = payload;

    const payment = await Payment.findOne({ gatewayOrderId: order_id });
    if (payment && payment.status !== 'completed') {
      payment.status = 'completed';
      payment.gatewayTransactionId = payment_id;
      payment.verified = true;
      payment.completedAt = new Date();
      await payment.save();

      // Update application if linked
      if (payment.application) {
        const application = await ServiceApplication.findById(payment.application);
        if (application) {
          application.payment.status = 'completed';
          application.payment.paidAt = new Date();
          application.payment.paymentId = payment_id;
          await application.save();
        }
      }
    }
  } else if (event === 'payment.failed') {
    const { order_id } = payload;
    const payment = await Payment.findOne({ gatewayOrderId: order_id });
    if (payment) {
      payment.status = 'failed';
      payment.failedAt = new Date();
      await payment.save();
    }
  }

  res.json({ success: true });
});