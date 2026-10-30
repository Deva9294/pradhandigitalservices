import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: 'India' },
  landmark: String,
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true,
    default: undefined,
    set: function(val) {
      if (!val || typeof val !== 'string' || val.trim() === '') return undefined;
      return val.toLowerCase().trim();
    }
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['customer', 'user', 'agent', 'staff', 'editor', 'admin', 'superadmin'],
    default: 'customer',
    set: function(val) {
      if (!val) return 'customer';
      const clean = String(val).toLowerCase().trim();
      if (clean === 'user') return 'customer';
      return clean;
    }
  },
  roleRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  avatar: {
    type: String,
    default: ''
  },
  
  // Addresses
  addresses: [addressSchema],
  
  // Profile
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedAt: Date,
  blockedReason: String,
  
  // Authentication
  otp: String,
  otpExpires: Date,
  passwordResetTokenHash: { type: String, select: false },
  passwordResetExpires: Date,
  refreshToken: String,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockedUntil: Date,
  
  // Wallet
  walletBalance: {
    type: Number,
    default: 0
  },
  
  // Referral
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralEarnings: {
    type: Number,
    default: 0
  },
  
  // Preferences
  preferredLanguage: {
    type: String,
    default: 'en',
    enum: ['en', 'hi']
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  fcmToken: String,
  
  // Location
  location: {
    lat: Number,
    lng: Number
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Deletion
  deletionRequested: {
    type: Boolean,
    default: false
  },
  deletionRequestedAt: Date,
  deletedAt: Date
}, {
  timestamps: true
});

// Normalize and validate before schema validation
userSchema.pre('validate', function(next) {
  if (this.role === 'user') {
    this.role = 'customer';
  }
  if (!this.email || (typeof this.email === 'string' && this.email.trim() === '')) {
    this.email = undefined;
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ phone: 1, isActive: 1 });
userSchema.index({ role: 1 });

export default mongoose.model('User', userSchema);
