import Payment from '../models/Payment.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const MERCHANT_UPI_ID = process.env.PDS_UPI_ID || '9294899787@sbi';

function requireAdmin(req) {
  if (!['admin', 'superadmin'].includes(req.user?.role)) {
    throw new AppError('Admin access required', 403);
  }
}

export const createUpiPayment = catchAsync(async (req, res) => {
  const amount = Number(req.body.amount);
  const { purpose = 'Pradhan Digital Services payment', applicationId } = req.body;
  if (!Number.isFinite(amount) || amount < 1 || amount > 500000) {
    throw new AppError('Amount must be between ₹1 and ₹5,00,000', 400);
  }

  const payment = await Payment.create({
    user: req.user._id,
    application: applicationId || undefined,
    type: 'service_application',
    amount,
    currency: 'INR',
    feeBreakdown: { governmentFee: 0, portalFee: amount, gatewayFee: 0, tax: 0, discount: 0, total: amount },
    gateway: 'manual',
    gatewayOrderId: `UPI-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    status: 'pending',
    metadata: {
      paymentMethod: 'direct_upi_qr',
      merchantUpiId: MERCHANT_UPI_ID,
      purpose: String(purpose).slice(0, 160),
      utr: null,
      utrSubmittedAt: null,
      verificationStatus: 'awaiting_payment'
    }
  });

  const note = `PDS-${payment.paymentId}`;
  const upiUri = `upi://pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent('Pradhan Digital Services')}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
  res.status(201).json({
    success: true,
    data: {
      id: payment._id,
      paymentId: payment.paymentId,
      amount: payment.amount,
      upiId: MERCHANT_UPI_ID,
      upiUri,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(upiUri)}`,
      status: payment.status
    }
  });
});

export const submitUpiUtr = catchAsync(async (req, res) => {
  const { paymentId, utr } = req.body;
  const cleanUtr = String(utr || '').trim().toUpperCase();
  if (!paymentId || !/^[A-Z0-9]{8,20}$/.test(cleanUtr)) {
    throw new AppError('Valid payment ID and 8–20 character UTR are required', 400);
  }

  const payment = await Payment.findOne({ paymentId, user: req.user._id, gateway: 'manual' });
  if (!payment) throw new AppError('Payment not found', 404);
  if (payment.status !== 'pending') throw new AppError('This payment is no longer awaiting verification', 409);

  const duplicate = await Payment.findOne({
    gateway: 'manual',
    'metadata.utr': cleanUtr,
    _id: { $ne: payment._id }
  });
  if (duplicate) throw new AppError('This UTR has already been submitted', 409);

  payment.metadata = {
    ...(payment.metadata?.toObject?.() || payment.metadata || {}),
    utr: cleanUtr,
    utrSubmittedAt: new Date(),
    verificationStatus: 'awaiting_admin_review'
  };
  await payment.save();

  res.json({
    success: true,
    message: 'UTR submitted. Payment will be marked successful only after admin verifies the bank credit.',
    data: { paymentId: payment.paymentId, status: payment.status, verificationStatus: 'awaiting_admin_review' }
  });
});

export const getMyUpiPayments = catchAsync(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id, gateway: 'manual' })
    .select('paymentId amount status metadata createdAt completedAt')
    .sort('-createdAt')
    .limit(50);
  res.json({ success: true, data: payments });
});

export const getUpiAdminPayments = catchAsync(async (req, res) => {
  requireAdmin(req);
  const filter = { gateway: 'manual' };
  if (req.query.status === 'submitted') { filter.status = 'pending'; filter['metadata.verificationStatus'] = 'awaiting_admin_review'; }
  if (req.query.status === 'completed') filter.status = 'completed';
  const payments = await Payment.find(filter)
    .populate('user', 'name phone email')
    .sort('-createdAt')
    .limit(200);
  res.json({ success: true, data: payments });
});

export const reviewUpiPayment = catchAsync(async (req, res) => {
  requireAdmin(req);
  const { action, note = '' } = req.body;
  if (!['approve', 'reject'].includes(action)) throw new AppError('Invalid review action', 400);

  const payment = await Payment.findOne({ _id: req.params.id, gateway: 'manual' });
  if (!payment) throw new AppError('Payment not found', 404);
  if (payment.status !== 'pending' || !payment.metadata?.utr) {
    throw new AppError('Only UTR-submitted pending payments can be reviewed', 409);
  }

  if (action === 'approve') {
    payment.status = 'completed';
    payment.verified = true;
    payment.gatewayTransactionId = payment.metadata.utr;
    payment.completedAt = new Date();
    payment.metadata.verificationStatus = 'admin_verified';
  } else {
    payment.status = 'failed';
    payment.failedAt = new Date();
    payment.metadata.verificationStatus = 'rejected';
  }
  payment.metadata.adminNote = String(note).slice(0, 500);
  payment.metadata.reviewedBy = String(req.user._id);
  payment.metadata.reviewedAt = new Date();
  payment.markModified('metadata');
  await payment.save();

  if (action === 'approve' && payment.application) {
    const ServiceApplication = (await import('../models/ServiceApplication.js')).default;
    const application = await ServiceApplication.findById(payment.application);
    if (application?.payment) {
      application.payment.status = 'completed';
      application.payment.paidAt = new Date();
      application.payment.paymentId = payment.metadata.utr;
      await application.save();
    }
  }

  res.json({ success: true, message: action === 'approve' ? 'Payment verified and marked completed' : 'Payment claim rejected', data: payment });
});
