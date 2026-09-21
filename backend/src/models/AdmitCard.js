import mongoose from 'mongoose';

const admitCardSchema = new mongoose.Schema({
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
  examName: {
    type: String,
    required: true,
    trim: true
  },
  examNameHi: {
    type: String,
    trim: true
  },
  conductingBody: {
    type: String,
    trim: true
  },
  
  // Schedule
  examDate: Date,
  examTime: String,
  reportingTime: String,
  duration: String,
  
  // Admit Card Details
  releaseDate: Date,
  downloadUrl: String,
  downloadInstructions: String,
  downloadInstructionsHi: String,
  
  // Required Documents
  documentsRequired: [{
    type: String
  }],
  
  // Official Information
  officialWebsite: String,
  notificationUrl: String,
  contactNumber: String,
  email: String,
  
  // Status
  status: {
    type: String,
    enum: ['upcoming', 'released', 'expired'],
    default: 'upcoming'
  },
  
  // Exam Reference
  examEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamEvent'
  },
  vacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vacancy'
  },
  
  // Metadata
  year: {
    type: Number,
    required: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
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

admitCardSchema.index({ slug: 1, isActive: 1 });
admitCardSchema.index({ releaseDate: 1, status: 1 });
admitCardSchema.index({ conductingBody: 1 });
admitCardSchema.index({ examEvent: 1 });
admitCardSchema.index({ vacancy: 1 });

export default mongoose.model('AdmitCard', admitCardSchema);