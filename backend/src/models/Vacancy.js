import mongoose from 'mongoose';

const vacancySchema = new mongoose.Schema({
  title: { type: String, trim: true },
  titleHi: { type: String, trim: true },
  titleHindi: { type: String, trim: true },
  slug: { type: String, trim: true, lowercase: true },
  shortDescription: { type: String, trim: true },
  department: { type: String, trim: true },
  organization: { type: String, trim: true },
  advertisementNumber: { type: String, trim: true },
  externalExamId: { type: String, trim: true },
  vacancyType: { type: String, enum: ['central', 'state', 'private', 'other'], default: 'state' },
  employmentType: { type: String, enum: ['regular', 'contract', 'part-time', 'temporary', 'other'], default: 'regular' },
  totalPosts: { type: Number, default: 0 },
  qualification: { type: String, trim: true },
  qualificationTags: [{ type: String, trim: true }],
  ageMinimum: { type: Number, default: 0 },
  ageMaximum: { type: Number, default: 0 },
  ageRelaxation: { type: String, trim: true },
  applicationFee: { type: String, trim: true },
  state: { type: String, default: 'Madhya Pradesh' },
  district: { type: String, trim: true },
  category: { type: String, enum: ['government', 'teaching', 'police', 'banking', 'railway', 'defence', 'other'], default: 'government' },
  startDate: { type: Date },
  lastDate: { type: Date },
  correctionDate: { type: Date },
  examDate: { type: Date },
  notificationUrl: { type: String, trim: true },
  applyUrl: { type: String, trim: true },
  officialWebsiteUrl: { type: String, trim: true },
  sourceName: { type: String, trim: true },
  sourceDomain: { type: String, trim: true },
  sourcePageUrl: { type: String, trim: true },
  sourceKey: { type: String, unique: true, sparse: true, index: true },
  contentHash: { type: String, trim: true },
  status: {
    type: String,
    enum: ['pending', 'upcoming', 'active', 'closed', 'cancelled', 'archived'],
    default: 'pending',
    index: true
  },
  verificationStatus: {
    type: String,
    enum: ['auto_verified', 'pending_review', 'admin_verified', 'rejected'],
    default: 'pending_review'
  },
  confidenceScore: { type: Number, default: 0.5 },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isUpdated: { type: Boolean, default: false },
  firstSeenAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now },
  lastCheckedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date },
  closedAt: { type: Date },
  revisionHistory: [{
    field: String,
    previous: mongoose.Schema.Types.Mixed,
    next: mongoose.Schema.Types.Mixed,
    changedAt: { type: Date, default: Date.now }
  }],
  relatedUpdates: [{ type: String }],
  applyLink: { type: String, trim: true },
  notificationPdf: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  syncMetadata: {
    sourceName: String,
    sourceDomain: String,
    sourcePageUrl: String,
    sourceKey: String,
    contentHash: String,
    parserVersion: String,
    lastSyncAt: Date,
  }
}, {
  timestamps: true
});

vacancySchema.index({ status: 1, lastDate: 1, department: 1, qualification: 1, publishedAt: -1 });

export default mongoose.model('Vacancy', vacancySchema);
