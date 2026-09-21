import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a service name'],
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
  category: {
    type: String,
    required: true,
    enum: ['government', 'recharge', 'financial', 'digital', 'offline-forms', 'vacancies', 'other']
  },
  subcategory: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionHi: {
    type: String
  },
  icon: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  processingTime: {
    type: String,
    default: '3-5 days'
  },
  documentsRequired: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Service', serviceSchema);
