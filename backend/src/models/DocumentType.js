import mongoose from 'mongoose';

const documentTypeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameHi: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  descriptionHi: {
    type: String,
    trim: true
  },
  acceptedFileTypes: {
    type: [String],
    default: ['image/jpeg', 'image/png', 'application/pdf', '.jpg', '.jpeg', '.png', '.pdf']
  },
  maxFileSizeMB: {
    type: Number,
    default: 5
  },
  maxFilesAllowed: {
    type: Number,
    default: 2
  },
  requiresFrontAndBack: {
    type: Boolean,
    default: false
  },
  hasExpiryDate: {
    type: Boolean,
    default: false
  },
  hasDocumentNumber: {
    type: Boolean,
    default: false
  },
  documentNumberLabel: {
    type: String,
    default: 'Document Number'
  },
  documentNumberLabelHi: {
    type: String,
    default: 'दस्तावेज़ संख्या'
  },
  privacyClassification: {
    type: String,
    enum: ['standard', 'sensitive', 'confidential'],
    default: 'standard'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('DocumentType', documentTypeSchema);
