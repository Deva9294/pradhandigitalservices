import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true,
    enum: [
      'create',
      'read',
      'update',
      'delete',
      'login',
      'logout',
      'payment',
      'refund',
      'status_change',
      'role_change',
      'export',
      'import',
      'system'
    ]
  },
  entityType: {
    type: String,
    required: true,
    enum: [
      'user',
      'agent',
      'service',
      'application',
      'payment',
      'vacancy',
      'scheme',
      'form',
      'notification',
      'support_ticket',
      'site_settings',
      'role',
      'document'
    ]
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  entityName: String,
  
  // Details
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Request Information
  ipAddress: String,
  userAgent: String,
  method: String,
  url: String,
  
  // Status
  status: {
    type: String,
    enum: ['success', 'failure', 'error'],
    default: 'success'
  },
  errorMessage: String,
  
  // Sensitive Data Masking
  sensitiveData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false
});

// Indexes
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

// Create TTL index to automatically delete logs older than 90 days
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export default mongoose.model('AuditLog', auditLogSchema);