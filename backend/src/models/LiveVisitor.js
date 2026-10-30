import mongoose from 'mongoose';

const liveVisitorSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  lastSeen: { type: Date, required: true, expires: 180, index: true },
}, { timestamps: true, versionKey: false });

export default mongoose.models.LiveVisitor || mongoose.model('LiveVisitor', liveVisitorSchema);
