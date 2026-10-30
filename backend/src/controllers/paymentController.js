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
    if (application?.payment) {
      application.payment.status = 'paid';
      application.payment.paidAt = new Date();
      application.payment.paymentId = gatewayPaymentId;
      if (application.status === 'draft') {
        application.status = 'submitted';
        application.processingDetails = application.processingDetails || {};
        application.processingDetails.submittedAt = new Date();
        application.statusHistory.push({
          status: 'submitted',
          remarks: 'Payment verified successfully through Razorpay.',
          changedBy: application.user,
          changedAt: new Date()
        });
      }
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

async function validateApplicationPayment(applicationId, user, amount) {
  if (!applicationId) return null;
  const application = await ServiceApplication.findById(applicationId);
  if (!application) throw new AppError('Application not found', 404);
  if (String(application.user) !== String(user._id) && !isAdmin(user)) {
    throw new AppError('Not authorized for this application', 403);
  }
  const expectedAmount = Number(application.payment?.totalAmount || application.payment?.amount || 0);
  if (!Number.isFinite(expectedAmount) || expectedAmount <= 0 ||
      Math.round(expectedAmount * 100) !== Math.round(amount * 100)) {
    throw new AppError('Payment amount does not match the application fee.', 400);
  }
  if (['paid', 'completed'].includes(application.payment?.status)) {
    throw new AppError('This application is already marked as paid.', 409);
  }
  return application;
}

export const createOrder = catchAsync(async (req, res) => {
  const currency = String(req.body.currency || 'INR').toUpperCase();
  const { type, applicationId, purpose, metadata } = req.body;

  if (currency !== 'INR') throw new AppError('Only INR payments are supported.', 400);
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new AppError('Online payment is temporarily unavailable. Razorpay credentials are not configured.', 503);
  }

  let application = null;
  let amount = Number(req.body.amount);
  if (applicationId) {
    application = await ServiceApplication.findById(applicationId);
    if (!application) throw new AppError('Application not found.', 404);
    if (String(application.user) !== String(req.user._id) && !isAdmin(req.user)) {
      throw new AppError('Not authorized for this application.', 403);
    }
    if (application.status !== 'draft' || ['paid', 'completed'].includes(application.payment?.status)) {
      throw new AppError('This application is not awaiting payment.', 409);
    }
    const serverAmount = Number(application.payment?.totalAmount || application.payment?.amount || 0);
    if (!Number.isFinite(serverAmount) || serverAmount < 1) {
      throw new AppError('Application fee is not configured. Please contact support.', 400);
    }
    if (Number.isFinite(amount) && amount > 0 && Math.round(amount * 100) !== Math.round(serverAmount * 100)) {
      throw new AppError('Payment amount does not match the server-calculated application fee.', 400);
    }
    amount = serverAmount;
  }

  if (!Number.isFinite(amount) || amount < 1 || amount > 500000) {
    throw new AppError('Enter a valid INR amount between ₹1 and ₹5,00,000.', 400);
  }

  const allowedTypes = ['service_application', 'form_download', 'recharge', 'bill_payment', 'wallet_topup'];
  const paymentType = application ? 'service_application' : (allowedTypes.includes(type) ? type : 'service_application');
  let payment = null;
  if (application) {
    payment = await Payment.findOne({ application: application._id }).sort('-createdAt');
    if (payment && String(payment.user) !== String(application.user)) {
      throw new AppError('Payment ownership does not match this application.', 403);
    }
    if (payment?.status === 'completed') throw new AppError('Payment already completed.', 409);
    if (payment && Math.round(Number(payment.amount) * 100) !== Math.round(amount * 100)) {
      throw new AppError('Existing payment amount does not match the application fee.', 409);
    }
  }

  const receipt = `PDS_${Date.now()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  if (!payment || ['failed', 'refunded'].includes(payment.status)) {
    payment = await Payment.create({
      user: application ? application.user : req.user._id,
      application: application?._id,
      type: paymentType,
      amount,
      currency,
      feeBreakdown: {
        governmentFee: application?.payment?.governmentFee || amount,
        portalFee: application?.payment?.portalFee || 0,
        gatewayFee: 0,
        tax: 0,
        discount: 0,
        total: amount
      },
      gateway: 'razorpay',
      status: 'pending',
      metadata: { purpose: String(purpose || 'Pradhan Digital Services payment').slice(0, 120), ...(metadata || {}) },
      initiatedAt: new Date()
    });
  }

  const adapter = PaymentAdapterFactory.getAdapter('razorpay');
  const order = await adapter.createOrder({
    amount,
    currency,
    receipt,
    notes: {
      paymentId: payment.paymentId,
      userId: String(payment.user),
      applicationId: application ? String(application._id) : '',
      purpose: String(purpose || paymentType).slice(0, 120)
    }
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
  const isOwner = String(payment.user?._id) === String(req.user._id);
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
  if (payment.status !== 'completed' && payment.status !== 'partially_refunded') {
    throw new AppError('Can only refund completed payments', 400);
  }
  if (!isAdmin(req.user)) throw new AppError('Not authorized', 403);

  const amount = Number(refundAmount);
  const remaining = Number(payment.amount) - Number(payment.refundAmount || 0);
  if (!Number.isFinite(amount) || amount <= 0 || amount > remaining) {
    throw new AppError('Invalid refund amount', 400);
  }
  const adapter = PaymentAdapterFactory.getAdapter(payment.gateway);
  const refund = await adapter.processRefund(payment.gatewayTransactionId, amount, refundReason);
  payment.refundAmount = Number(payment.refundAmount || 0) + amount;
  payment.refundReason = String(refundReason || '').slice(0, 500);
  payment.refundId = refund.refundId;
  payment.refundedAt = new Date();
  payment.status = payment.refundAmount >= Number(payment.amount) ? 'refunded' : 'partially_refunded';
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
    const payment = await Payment.findOne({
      gateway: 'razorpay',
      gatewayOrderId: entity.order_id,
      status: { $nin: ['completed', 'refunded', 'partially_refunded'] }
    });
    if (payment) {
      payment.status = 'failed';
      payment.failedAt = new Date();
      await payment.save();
    }
  }

  res.json({ success: true, received: true });
});
