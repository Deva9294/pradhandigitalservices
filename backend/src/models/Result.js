import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
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
  
  // Result Details
  declarationDate: {
    type: Date,
    required: true
  },
  resultUrl: String,
  scorecardUrl: String,
  cutoffMarks: {
    general: Number,
    obc: Number,
    sc: Number,
    st: Number,
    ews: Number,
    pwd: Number
  },
  
  // Statistics
  totalCandidates: Number,
  totalAppeared: Number,
  totalQualified: Number,
  qualifyingPercentage: Number,
  
  // Toppers
  toppers: [{
    rank: Number,
    name: String,
    score: Number,
    state: String
  }],
  
  // Official Information
  officialWebsite: String,
  notificationUrl: String,
  contactNumber: String,
  email: String,
  
  // Status
  status: {
    type: String,
    enum: ['upcoming', 'declared', 'processing'],
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
  admitCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdmitCard'
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

resultSchema.index({ slug: 1, isActive: 1 });
resultSchema.index({ declarationDate: 1, status: 1 });
resultSchema.index({ conductingBody: 1 });
resultSchema.index({ examEvent: 1 });
resultSchema.index({ vacancy: 1 });

export default mongoose.model('Result', resultSchema);