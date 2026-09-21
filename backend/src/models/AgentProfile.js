import mongoose from 'mongoose';

const agentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  agentCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  businessName: {
    type: String,
    trim: true
  },
  shopName: {
    type: String,
    trim: true
  },
  shopAddress: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  location: {
    lat: Number,
    lng: Number
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'submitted', 'under_review', 'verified', 'rejected'],
    default: 'pending'
  },
  kycDocuments: {
    aadhaar: String,
    pan: String,
    shopLicense: String,
    photo: String
  },
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    upiId: String
  },
  commissionRate: {
    type: Number,
    default: 10
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  totalTransactions: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  assignedAreas: [{
    type: String
  }],
  serviceCategories: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

agentProfileSchema.index({ user: 1 });
agentProfileSchema.index({ agentCode: 1 });
agentProfileSchema.index({ kycStatus: 1, isActive: 1 });

export default mongoose.model('AgentProfile', agentProfileSchema);