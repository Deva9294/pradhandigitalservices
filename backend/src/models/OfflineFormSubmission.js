import mongoose from 'mongoose';

const offlineFormSubmissionSchema = new mongoose.Schema({
  submissionId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  formId: { type: String, required: true, index: true },
  formName: { type: String, required: true },
  formData: { type: mongoose.Schema.Types.Mixed, default: {} },
  documents: [{
    type: { type: String, required: true },
    url: { type: String, required: true },
    fileName: String
  }],
  status: { type: String, enum: ['submitted', 'under_review', 'correction_required', 'completed', 'rejected'], default: 'submitted' },
  processingTime: String,
  estimatedCompletion: Date
}, { timestamps: true });

offlineFormSubmissionSchema.index({ user: 1, createdAt: -1 });
offlineFormSubmissionSchema.pre('validate', function(next) {
  if (!this.submissionId) {
    this.submissionId = `PDS-FRM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('OfflineFormSubmission', offlineFormSubmissionSchema);
