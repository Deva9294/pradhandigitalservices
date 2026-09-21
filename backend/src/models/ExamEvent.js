import mongoose from 'mongoose';

const examEventSchema = new mongoose.Schema({
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
  conductingBody: {
    type: String,
    trim: true
  },
  examType: {
    type: String,
    enum: ['entrance', 'recruitment', 'competitive', 'board', 'university', 'other'],
    default: 'recruitment'
  },
  
  // Schedule
  examDate: {
    type: Date,
    required: true
  },
  examTime: {
    type: String,
    trim: true
  },
  reportingTime: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  
  // Admit Card
  admitCardReleaseDate: Date,
  admitCardUrl: String,
  
  // Result
  resultDeclarationDate: Date,
  resultUrl: String,
  
  // Answer Key
  answerKeyReleaseDate: Date,
  answerKeyUrl: String,
  
  // Locations
  examCenters: [{
    centerCode: String,
    centerName: String,
    address: String,
    city: String,
    state: String
  }],
  
  // Eligibility
  eligibility: {
    type: String,
    trim: true
  },
  eligibilityHi: {
    type: String,
    trim: true
  },
  
  // Documents Required
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
    enum: ['upcoming', 'admit_card_released', 'conducted', 'result_declared', 'cancelled'],
    default: 'upcoming'
  },
  
  // Metadata
  year: {
    type: Number,
    required: true
  },
  session: {
    type: String,
    enum: ['2025-26', '2026-27', '2027-28'],
    default: '2026-27'
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

examEventSchema.index({ slug: 1, isActive: 1 });
examEventSchema.index({ examDate: 1, status: 1 });
examEventSchema.index({ conductingBody: 1 });
examEventSchema.index({ year: 1, examType: 1 });

export default mongoose.model('ExamEvent', examEventSchema);