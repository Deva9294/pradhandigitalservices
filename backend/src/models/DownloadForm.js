import mongoose from 'mongoose';

const downloadFormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleHi: {
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
  
  // Categorization
  category: {
    type: String,
    required: true,
    enum: ['government', 'education', 'health', 'legal', 'financial', 'other'],
    default: 'government'
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    enum: ['central', 'madhya_pradesh', 'other'],
    default: 'central'
  },
  
  // File Information
  language: {
    type: String,
    enum: ['english', 'hindi', 'both'],
    default: 'both'
  },
  format: {
    type: String,
    enum: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    default: 'pdf'
  },
  fileSize: {
    type: Number
  },
  pageCount: Number,
  version: {
    type: String,
    default: '1.0'
  },
  
  // File URL
  fileUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  
  // Pricing
  isFree: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 5
  },
  
  // Official Information
  officialSource: {
    type: String,
    trim: true
  },
  officialUrl: String,
  sourceLastUpdated: Date,
  
  // Related Service
  relatedService: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  
  // Usage Statistics
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'deprecated', 'expired'],
    default: 'active'
  },
  expiryDate: Date,
  
  // Version History
  versionHistory: [{
    version: String,
    fileUrl: String,
    uploadedAt: Date,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changeNotes: String
  }],
  
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
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

downloadFormSchema.index({ slug: 1, isActive: 1 });
downloadFormSchema.index({ category: 1, department: 1 });
downloadFormSchema.index({ state: 1, status: 1 });
downloadFormSchema.index({ downloadCount: -1 });

export default mongoose.model('DownloadForm', downloadFormSchema);