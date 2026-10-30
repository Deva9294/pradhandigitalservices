import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceApplication'
  },
  type: {
    type: String,
    enum: ['service_application', 'form_download', 'recharge', 'bill_payment', 'wallet_topup', 'membership'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Fee Breakdown
  feeBreakdown: {
    governmentFee: { type: Number, default: 0 },
    portalFee: { type: Number, default: 0 },
    gatewayFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  
  // Payment Gateway
  gateway: {
    type: String,
    enum: ['razorpay', 'payu', 'paytm', 'phonepe', 'cashfree', 'bbps', 'manual'],
    required: true
  },
  gatewayOrderId: String,
  gatewayTransactionId: String,
  gatewayPaymentId: String,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  
  // Timestamps
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  failedAt: Date,
  refundedAt: Date,
  
  // Refund
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String,
  refundId: String,
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Verification
  signature: String,
  verified: {
    type: Boolean,
    default: false
  },
  
  // Invoice
  invoiceNumber: String,
  invoiceUrl: String,
  
  // Agent Commission
  agentCommission: {
    type: Number,
    default: 0
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate payment ID before saving
paymentSchema.pre('save', function generatePaymentId(next) {
  if (!this.paymentId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    this.paymentId = `PAY${timestamp}${random}`;
  }
  next();
});

// Indexes
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ application: 1 });
paymentSchema.index({ gatewayTransactionId: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);