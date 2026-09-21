import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameHi: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  descriptionHi: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['agriculture', 'education', 'health', 'housing', 'employment', 'women', 'senior_citizen', 'disability', 'other'],
    required: true
  },
  ministry: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    default: 'All India'
  },
  eligibility: {
    type: String,
    trim: true
  },
  eligibilityHi: {
    type: String,
    trim: true
  },
  benefits: {
    type: String,
    trim: true
  },
  benefitsHi: {
    type: String,
    trim: true
  },
  requiredDocuments: [{
    type: String
  }],
  applicationProcess: {
    type: String,
    trim: true
  },
  applicationProcessHi: {
    type: String,
    trim: true
  },
  officialWebsite: {
    type: String,
    trim: true
  },
  applyUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'upcoming'],
    default: 'active'
  },
  startDate: Date,
  endDate: Date,
  lastDateToApply: Date,
  icon: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

schemeSchema.index({ slug: 1, isActive: 1 });
schemeSchema.index({ category: 1, status: 1 });
schemeSchema.index({ state: 1 });
schemeSchema.index({ isFeatured: 1, status: 1 });

export default mongoose.model('Scheme', schemeSchema);