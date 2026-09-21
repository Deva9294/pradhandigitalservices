import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'payment', 'application', 'technical', 'account', 'refund', 'complaint', 'suggestion'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed'],
    default: 'open'
  },
  
  // Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date,
  
  // Related entities
  relatedApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceApplication'
  },
  relatedPayment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  
  // Resolution
  resolution: {
    type: String,
    trim: true
  },
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Customer Satisfaction
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    trim: true
  },
  
  // Attachments
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Messages
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    attachments: [{
      fileName: String,
      fileUrl: String
    }]
  }],
  
  // SLA
  responseDueAt: Date,
  resolutionDueAt: Date,
  
  // Metadata
  source: {
    type: String,
    enum: ['web', 'mobile', 'email', 'phone', 'whatsapp'],
    default: 'web'
  },
  userAgent: String,
  ipAddress: String,
  
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

// Generate ticket number before saving
supportTicketSchema.pre('save', function generateTicketNumber(next) {
  if (!this.ticketNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).slice(2, 4).toUpperCase();
    this.ticketNumber = `TKT${timestamp}${random}`;
  }
  next();
});

// Indexes
supportTicketSchema.index({ ticketNumber: 1 });
supportTicketSchema.index({ user: 1, status: 1 });
supportTicketSchema.index({ assignedTo: 1 });
supportTicketSchema.index({ status: 1, priority: 1, createdAt: -1 });

export default mongoose.model('SupportTicket', supportTicketSchema);