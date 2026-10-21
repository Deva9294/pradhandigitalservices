import mongoose from 'mongoose';

const applicationStatusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['draft', 'submitted', 'documents_under_review', 'correction_required', 'processing', 'completed', 'rejected', 'cancelled'],
    required: true
  },
  remarks: {
    type: String,
    trim: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
});

const serviceApplicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'documents_under_review', 'correction_required', 'processing', 'completed', 'rejected', 'cancelled'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['normal', 'urgent', 'critical'],
    default: 'normal'
  },
  
  // Applicant Information
  applicantDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    fatherName: String,
    motherName: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String
    }
  },
  
  // Service-specific data
  serviceData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Documents
  documents: [{
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    fileName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    },
    remarks: String
  }],
  
  // Payment Information
  payment: {
    amount: { type: Number, default: 0 },
    governmentFee: { type: Number, default: 0 },
    portalFee: { type: Number, default: 0 },
    gatewayFee: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentId: String,
    paymentMethod: String,
    paidAt: Date
  },
  
  // Fee Breakdown
  feeBreakdown: {
    governmentFee: { type: Number, default: 0 },
    assistanceCharge: { type: Number, default: 0 },
    convenienceFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  
  // Processing Information
  processingDetails: {
    submittedAt: Date,
    estimatedCompletionDate: Date,
    actualCompletionDate: Date,
    processingOffice: String,
    applicationNumber: String,
    referenceNumber: String
  },
  
  // Remarks and Notes
  adminRemarks: {
    type: String,
    trim: true
  },
  agentRemarks: {
    type: String,
    trim: true
  },
  customerNotes: {
    type: String,
    trim: true
  },
  
  // Status History
  statusHistory: [applicationStatusHistorySchema],
  
  // Completed Documents
  completedDocuments: [{
    type: String,
    url: String,
    issuedAt: Date,
    expiryDate: Date
  }],
  
  // Cancellation/Rejection
  cancellationReason: String,
  rejectionReason: String,
  cancelledAt: Date,
  rejectedAt: Date,
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate application ID before saving
serviceApplicationSchema.pre('save', function generateApplicationId(next) {
  if (!this.applicationId) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    this.applicationId = `APP${timestamp}${random}`;
  }
  next();
});

// Indexes
serviceApplicationSchema.index({ user: 1, status: 1 });
serviceApplicationSchema.index({ agent: 1 });
serviceApplicationSchema.index({ service: 1 });
serviceApplicationSchema.index({ status: 1, createdAt: -1 });
serviceApplicationSchema.index({ 'applicantDetails.phone': 1 });

export default mongoose.model('ServiceApplication', serviceApplicationSchema);