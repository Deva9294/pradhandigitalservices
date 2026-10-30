import crypto from 'crypto';
import Payment from '../models/Payment.js';
import ServiceApplication from '../models/ServiceApplication.js';
import PaymentAdapterFactory from '../services/paymentAdapter.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const isAdmin = (user) => ['admin', 'superadmin'].includes(user?.role);

async function markPaymentCompleted(payment, gatewayPaymentId) {
  if (payment.status === 'completed') return payment;
  payment.status = 'completed';
  payment.gatewayTransactionId = gatewayPaymentId;
  payment.gatewayPaymentId = gatewayPaymentId;
  payment.verified = true;
  payment.completedAt = new Date();
  await payment.save();

  if (payment.application) {
    const application = await ServiceApplication.findById(payment.application);
    if (application) {
      application.payment.status = 'completed';
      application.payment.paidAt = new Date();
      application.payment.paymentId = gatewayPaymentId;
      await application.save();
    }
  }
  return payment;
}

function safeSignatureEqual(expected, received) {
  if (typeof received !== 'string' || !/^[a-f0-9]{64}$/i.test(received)) return false;
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(received, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const createOrder = catchAsync(async (req, res) => {
  const amount = Number(req.body.amount);
  const currency = String(req.body.currency || 'INR').toUpperCase();
  const { type, applicationId } = req.body;

  if (!Number.isFinite(amount) || amount < 1 || amount > 500000 || currency !== 'INR') {
    throw new AppError('Enter a valid INR amount between ₹1 and ₹5,00,000.', 400);
  }
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new AppError('Online payment is temporarily unavailable. Razorpay credentials are not configured.', 503);
  }

  let payment;
  if (applicationId) {
    const application = await ServiceApplication.findById(applicationId);
    if (!application) throw new AppError('Application not found', 404);
    if (application.user && String(application.user) !== String(req.user._id) && !isAdmin(req.user)) {
      throw new AppError('Not authorized for this application', 403);
    }
    payment = await Payment.findOne({ application: applicationId, user: req.user._id });
    if (payment && payment.status === 'completed') {
      throw new AppError('Payment already completed', 400);
    }
  }

  const receipt = `PDS_${Date.now()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  if (!payment) {
    payment = await Payment.create({
      user: req.user._id,
      application: applicationId,
      type: type || 'service_application',
      amount,
      currency,
      feeBreakdown: { governmentFee: amount, portalFee: 0, convenienceFee: 0, tax: 0, total: amount },
      gateway: 'razorpay',
      status: 'pending',
      initiatedAt: new Date()
    });
  }

  const adapter = PaymentAdapterFactory.getAdapter('razorpay');
  const order = await adapter.createOrder({
    amount,
    currency,
    receipt,
    notes: { paymentId: payment.paymentId, userId: String(req.user._id), applicationId: applicationId ? String(applicationId) : '' }
  });

  payment.gateway = 'razorpay';
  payment.gatewayOrderId = order.orderId;
  payment.metadata = { ...(payment.metadata || {}), razorpayReceipt: receipt };
  await payment.save();

  res.json({
    success: true,
    data: {
      paymentId: payment.paymentId,
      orderId: order.orderId,
      amount: Math.round(amount * 100),
      currency,
      key: process.env.RAZORPAY_KEY_ID
    }
  });
});

export const verifyPayment = catchAsync(async (req, res) => {
  const { paymentId, gateway = 'razorpay', ...paymentData } = req.body;
  const payment = await Payment.findOne({ paymentId });
  if (!payment) throw new AppError('Payment not found', 404);
  if (String(payment.user) !== String(req.user._id) && !isAdmin(req.user)) {
    throw new AppError('Not authorized to verify this payment', 403);
  }
  if (payment.status === 'completed') {
    return res.json({ success: true, message: 'Payment already verified', data: payment });
  }
  if (gateway !== 'razorpay' || payment.gateway !== 'razorpay') {
    throw new AppError('Unsupported payment gateway', 400);
  }
  if (!payment.gatewayOrderId || payment.gatewayOrderId !== paymentData.razorpay_order_id) {
    throw new AppError('Payment order does not match this transaction', 400);
  }

  const adapter = PaymentAdapterFactory.getAdapter('razorpay');
  const verification = await adapter.verifyPayment(paymentData);
  if (!verification.success || verification.status !== 'captured') {
    throw new AppError('Razorpay has not confirmed a captured payment.', 400);
  }
  if (verification.orderId !== payment.gatewayOrderId ||
      Math.round(Number(verification.amount) * 100) !== Math.round(Number(payment.amount) * 100) ||
      verification.currency !== payment.currency) {
    throw new AppError('Payment amount, currency, or order does not match.', 400);
  }

  await markPaymentCompleted(payment, verification.paymentId);
  res.json({ success: true, data: payment });
});

export const getPayment = catchAsync(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('user', 'name email')
    .populate('application');
  if (!payment) throw new AppError('Payment not found', 404);
  const isOwner = String(payment.user._id) === String(req.user._id);
  if (!isOwner && !isAdmin(req.user)) throw new AppError('Not authorized', 403);
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
  if (payment.status !== 'completed') throw new AppError('Can only refund completed payments', 400);
  if (!isAdmin(req.user)) throw new AppError('Not authorized', 403);
  if (!Number.isFinite(Number(refundAmount)) || refundAmount <= 0 || refundAmount > payment.amount) {
    throw new AppError('Invalid refund amount', 400);
  }
  const adapter = PaymentAdapterFactory.getAdapter(payment.gateway);
  const refund = await adapter.processRefund(payment.gatewayTransactionId, refundAmount, refundReason);
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
  if (!secret) throw new AppError('Razorpay webhook is not configured', 503);
  if (!req.rawBody) throw new AppError('Webhook raw body is unavailable', 400);

  const expected = crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');
  if (!safeSignatureEqual(expected, signature)) {
    throw new AppError('Invalid webhook signature', 400);
  }

  const event = req.body?.event;
  const entity = req.body?.payload?.payment?.entity;
  if (event === 'payment.captured' && entity?.order_id && entity?.id) {
    const payment = await Payment.findOne({ gateway: 'razorpay', gatewayOrderId: entity.order_id });
    if (payment && Math.round(Number(entity.amount)) === Math.round(Number(payment.amount) * 100) &&
        entity.currency === payment.currency) {
      await markPaymentCompleted(payment, entity.id);
    }
  } else if (event === 'payment.failed' && entity?.order_id) {
    const payment = await Payment.findOne({ gateway: 'razorpay', gatewayOrderId: entity.order_id, status: { $ne: 'completed' } });
    if (payment) {
      payment.status = 'failed';
      payment.failedAt = new Date();
      await payment.save();
    }
  }

  res.json({ success: true, received: true });
});
