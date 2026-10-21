import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a service name'],
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
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  categoryHi: {
    type: String,
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  subcategoryHi: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionHi: {
    type: String
  },
  icon: {
    type: String,
    default: 'FileText'
  },
  
  // Official Department & Portal Information
  department: {
    type: String,
    trim: true
  },
  departmentHi: {
    type: String,
    trim: true
  },
  departmentLogo: {
    type: String,
    default: ''
  },
  officialWebsiteUrl: {
    type: String,
    trim: true
  },
  directApplyUrl: {
    type: String,
    trim: true
  },
  notificationUrl: {
    type: String,
    trim: true
  },
  officialHelpline: {
    type: String,
    trim: true
  },
  officialSource: {
    type: String,
    trim: true
  },
  lastVerifiedDate: {
    type: Date,
    default: Date.now
  },
  linkStatus: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },

  // Eligibility & Application Rules
  whoCanApply: {
    type: String
  },
  whoCanApplyHi: {
    type: String
  },
  eligibility: [{
    type: String
  }],
  eligibilityHi: [{
    type: String
  }],

  // Documents
  requiredDocuments: [{
    type: String
  }],
  requiredDocumentsHi: [{
    type: String
  }],
  optionalDocuments: [{
    type: String
  }],
  optionalDocumentsHi: [{
    type: String
  }],
  documentRequirements: [{
    documentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentType'
    },
    code: String,
    name: String,
    nameHi: String,
    isMandatory: {
      type: Boolean,
      default: true
    },
    instructions: String,
    instructionsHi: String
  }],
  // Backward compatibility
  documentsRequired: [{
    type: String
  }],

  // Pricing & Timeline
  governmentFee: {
    type: Number,
    default: 0
  },
  serviceCharge: {
    type: Number,
    default: 50
  },
  totalFee: {
    type: Number,
    default: 50
  },
  price: {
    type: Number,
    default: 50
  },
  processingTime: {
    type: String,
    default: '3-7 Days'
  },
  processingTimeHi: {
    type: String,
    default: '3-7 कार्य दिवस'
  },

  // Steps & Instructions
  steps: [{
    type: String
  }],
  stepsHi: [{
    type: String
  }],
  instructions: [{
    type: String
  }],
  instructionsHi: [{
    type: String
  }],

  // FAQs
  faqs: [{
    question: String,
    questionHi: String,
    answer: String,
    answerHi: String
  }],

  // Custom Disclaimer
  disclaimer: {
    type: String
  },
  disclaimerHi: {
    type: String
  },

  // Status & Visibility
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Pre-save hook to ensure totalFee and price are kept in sync
serviceSchema.pre('save', function (next) {
  if (this.governmentFee !== undefined && this.serviceCharge !== undefined) {
    this.totalFee = (this.governmentFee || 0) + (this.serviceCharge || 0);
    this.price = this.totalFee;
  }
  // Sync documentsRequired for backwards compatibility
  if (this.requiredDocuments && this.requiredDocuments.length > 0) {
    this.documentsRequired = this.requiredDocuments;
  }
  next();
});

export default mongoose.model('Service', serviceSchema);
