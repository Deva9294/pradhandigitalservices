import mongoose from 'mongoose';

const applicationDocumentSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceApplication',
    required: true
  },
  documentType: {
    type: String,
    required: true,
    enum: ['aadhaar', 'pan', 'voter_id', 'driving_licence', 'passport', 'income_certificate', 'caste_certificate', 'domicile_certificate', 'birth_certificate', 'death_certificate', 'marksheet', 'degree_certificate', 'photo', 'signature', 'other']
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  remarks: {
    type: String,
    trim: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

applicationDocumentSchema.index({ application: 1, documentType: 1 });
applicationDocumentSchema.index({ uploadedBy: 1 });
applicationDocumentSchema.index({ isDeleted: 1 });

export default mongoose.model('ApplicationDocument', applicationDocumentSchema);