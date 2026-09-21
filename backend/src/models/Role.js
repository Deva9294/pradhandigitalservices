import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['customer', 'agent', 'staff', 'editor', 'admin', 'superadmin'],
    default: 'customer'
  },
  description: {
    type: String,
    trim: true
  },
  permissions: [{
    type: String,
    enum: [
      'view_services',
      'manage_services',
      'view_users',
      'manage_users',
      'view_applications',
      'manage_applications',
      'view_vacancies',
      'manage_vacancies',
      'view_forms',
      'manage_forms',
      'view_payments',
      'manage_payments',
      'view_analytics',
      'manage_settings',
      'view_audit_logs',
      'manage_roles'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
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

roleSchema.index({ name: 1, isActive: 1 });

export default mongoose.model('Role', roleSchema);