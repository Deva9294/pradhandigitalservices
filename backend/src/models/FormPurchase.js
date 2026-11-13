import mongoose from 'mongoose';

const formPurchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'DownloadForm', required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['completed', 'refunded'], default: 'completed' },
  purchasedAt: { type: Date, default: Date.now },
  downloadedAt: Date
}, { timestamps: true });

formPurchaseSchema.index({ user: 1, form: 1 }, { unique: true });
export default mongoose.model('FormPurchase', formPurchaseSchema);
