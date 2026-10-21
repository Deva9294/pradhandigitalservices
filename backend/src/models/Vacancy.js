import mongoose from 'mongoose';

const vacancySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  titleHi: { type: String, trim: true },
  titleHindi: { type: String, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  shortDescription: { type: String, trim: true },
  shortDescriptionHi: { type: String, trim: true },
  department: { type: String, required: true, trim: true },
  departmentHi: { type: String, trim: true },
  organization: { type: String, trim: true },
  organizationHi: { type: String, trim: true },
  recruitingAuthority: { type: String, trim: true }, // e.g. MPESB, MPPSC, SSC, UPSC, RRB
  advertisementNumber: { type: String, trim: true },
  recruitmentYear: { type: String, trim: true },
  externalExamId: { type: String, trim: true },
  
  // Classification
  vacancyType: { 
    type: String, 
    enum: ['central', 'state', 'private', 'other'], 
    default: 'state' 
  },
  locationScope: {
    type: String,
    enum: ['MP', 'All India', 'State', 'District'],
    default: 'MP'
  },
  state: { type: String, default: 'Madhya Pradesh' },
  district: { type: String, trim: true },
  category: { 
    type: String, 
    enum: ['government', 'teaching', 'police', 'banking', 'railway', 'defence', 'health', 'engineering', 'judiciary', 'other'], 
    default: 'government' 
  },
  employmentType: { 
    type: String, 
    enum: ['regular', 'contract', 'apprentice', 'part-time', 'temporary', 'other'], 
    default: 'regular' 
  },
  applicationMode: {
    type: String,
    enum: ['online', 'offline', 'both'],
    default: 'online'
  },
  totalPosts: { type: Number, default: 0 },
  salary: { type: String, trim: true },

  // Posts Breakdown
  postDetails: [{
    postName: String,
    postNameHi: String,
    vacanciesCount: Number,
    qualification: String,
    ageLimit: String,
    salary: String,
    categoryBreakdown: {
      ur: Number,
      ews: Number,
      obc: Number,
      sc: Number,
      st: Number,
      female: Number,
      pwd: Number
    }
  }],

  // Qualifications & Age
  qualification: { type: String, trim: true },
  qualificationLevel: {
    type: String,
    enum: ['8th', '10th', '12th', 'ITI', 'Diploma', 'Graduate', 'Postgraduate', 'Professional', 'Other'],
    default: 'Graduate'
  },
  qualificationTags: [{ type: String, trim: true }],
  ageMinimum: { type: Number, default: 18 },
  ageMaximum: { type: Number, default: 40 },
  ageCalculationDate: { type: Date },
  ageRelaxation: { type: String, trim: true },
  domicileRequirement: { type: String, trim: true },
  physicalRequirements: { type: String, trim: true },

  // Important Dates
  startDate: { type: Date },
  lastDate: { type: Date },
  feeLastDate: { type: Date },
  correctionDate: { type: Date },
  correctionEndDate: { type: Date },
  examDate: { type: Date },
  examDateNote: { type: String, trim: true },
  citySlipDate: { type: Date },
  admitCardDate: { type: Date },
  answerKeyDate: { type: Date },
  objectionDeadline: { type: Date },
  resultDate: { type: Date },
  dvDate: { type: Date },
  isClosingTimeSpecified: { type: Boolean, default: true },
  tentativeDatesNote: { type: String, trim: true },

  // Official Fee Structure
  feeDetails: {
    isUnknown: { type: Boolean, default: false },
    general: { type: Number, default: 0 },
    obc: { type: Number, default: 0 },
    ews: { type: Number, default: 0 },
    sc: { type: Number, default: 0 },
    st: { type: Number, default: 0 },
    female: { type: Number, default: 0 },
    pwd: { type: Number, default: 0 },
    portalCharges: { type: Number, default: 0 },
    exemptions: [String],
    note: String
  },
  applicationFee: { type: String, trim: true }, // Legacy compatibility string
  isFeeExempt: { type: Boolean, default: false },

  // PDS Facilitation
  pdsAssistance: {
    isAvailable: { type: Boolean, default: true },
    fee: { type: Number, default: 50 },
    notes: String
  },

  // Document Requirement Checklist
  documentChecklist: [{
    documentName: { type: String, required: true },
    documentNameHi: String,
    requirementType: { type: String, enum: ['mandatory', 'conditional', 'optional'], default: 'mandatory' },
    stage: { type: String, enum: ['application', 'examination', 'document_verification'], default: 'application' },
    allowedFormats: [String],
    maxSizeKB: Number,
    dimensions: String,
    notificationReference: String
  }],

  // Selection Stages & Syllabus
  selectionProcess: [{
    stageNumber: Number,
    title: String,
    titleHi: String,
    description: String
  }],
  applicationInstructions: { type: String, trim: true },
  applicationInstructionsHi: { type: String, trim: true },

  // Offline Form Dispatch
  offlineFormDetails: {
    formPdfUrl: String,
    submissionAddress: String,
    deadlineType: { type: String, enum: ['dispatch', 'receipt'], default: 'receipt' }
  },

  // Official Links (Never invent links)
  officialWebsiteUrl: { type: String, trim: true },
  applyUrl: { type: String, trim: true },
  applyLink: { type: String, trim: true }, // Legacy alias
  notificationUrl: { type: String, trim: true },
  notificationPdf: { type: String, trim: true },
  corrigendumUrl: { type: String, trim: true },
  syllabusUrl: { type: String, trim: true },
  admitCardUrl: { type: String, trim: true },
  answerKeyUrl: { type: String, trim: true },
  resultUrl: { type: String, trim: true },
  scorecardUrl: { type: String, trim: true },
  meritListUrl: { type: String, trim: true },
  dvNoticeUrl: { type: String, trim: true },

  // Sync & Status
  sourceName: { type: String, trim: true },
  sourceDomain: { type: String, trim: true },
  sourcePageUrl: { type: String, trim: true },
  sourceKey: { type: String, unique: true, sparse: true, index: true },
  contentHash: { type: String, trim: true },
  status: {
    type: String,
    enum: ['pending', 'upcoming', 'active', 'closing_soon', 'closed', 'cancelled', 'archived'],
    default: 'active',
    index: true
  },
  verificationStatus: {
    type: String,
    enum: ['auto_verified', 'pending_review', 'admin_verified', 'rejected'],
    default: 'admin_verified'
  },
  confidenceScore: { type: Number, default: 1.0 },
  isFeatured: { type: Boolean, default: false },
  isNewlyAdded: { type: Boolean, default: false },
  isUpdated: { type: Boolean, default: false },
  isExtended: { type: Boolean, default: false },
  isReopened: { type: Boolean, default: false },
  extensionNotice: { type: String, trim: true },

  // Dates & Timestamps
  firstSeenAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now },
  lastCheckedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date, default: Date.now },
  closedAt: { type: Date },

  // Revisions & Audit Log
  revisionHistory: [{
    field: String,
    previous: mongoose.Schema.Types.Mixed,
    next: mongoose.Schema.Types.Mixed,
    reason: String,
    sourceNotice: String,
    changedAt: { type: Date, default: Date.now }
  }],
  relatedUpdates: [{ type: String }],
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  syncMetadata: {
    sourceName: String,
    sourceDomain: String,
    sourcePageUrl: String,
    sourceKey: String,
    contentHash: String,
    parserVersion: String,
    lastSyncAt: Date
  }
}, {
  timestamps: true
});

// Indexes for fast filtered queries
vacancySchema.index({ status: 1, lastDate: 1, department: 1, locationScope: 1, qualificationLevel: 1 });
vacancySchema.index({ recruitingAuthority: 1 });

// Helper method to compute dynamic status based on exact timestamps
vacancySchema.methods.calculateDynamicStatus = function() {
  const now = new Date();
  if (this.status === 'cancelled') return 'cancelled';
  if (this.startDate && now < this.startDate) return 'upcoming';
  if (this.lastDate) {
    if (now > this.lastDate) return 'closed';
    const msLeft = this.lastDate.getTime() - now.getTime();
    const daysLeft = msLeft / (1000 * 60 * 60 * 24);
    if (daysLeft <= 7) return 'closing_soon';
    return 'active';
  }
  return this.status || 'active';
};

export default mongoose.model('Vacancy', vacancySchema);
