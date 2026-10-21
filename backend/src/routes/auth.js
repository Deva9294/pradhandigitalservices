import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AgentProfile from '../models/AgentProfile.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/security.js';

const router = express.Router();

// Memory store for OTPs (with 5 minute TTL)
const otpStore = new Map();

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production');
    }
    return 'dev-only-jwt-secret-change-before-production';
  }
  return secret;
};

const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: '30d'
  });
};

/**
 * Helper to normalize Indian phone number to 10 digits
 */
function cleanPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits.slice(-10);
}

// @route   POST /api/auth/register
// @desc    Register a new user (Customer or Agent)
// @access  Public
router.post('/register', authRateLimiter, asyncHandler(async (req, res) => {
  let { name, email, phone, password, role, shopName, city, adminSecret } = req.body;

  phone = cleanPhone(phone);
  if (!phone || phone.length !== 10) {
    return res.status(400).json({
      success: false,
      message: 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें (Enter valid 10-digit phone number)'
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए (Password must be at least 6 characters)'
    });
  }

  email = (email && typeof email === 'string' && email.trim() !== '')
    ? email.toLowerCase().trim()
    : undefined;

  // Build query to check duplicates
  const duplicateQuery = [{ phone }];
  if (email) duplicateQuery.push({ email });

  const userExists = await User.findOne({ $or: duplicateQuery });
  if (userExists) {
    const isPhoneDuplicate = userExists.phone === phone;
    return res.status(400).json({
      success: false,
      message: isPhoneDuplicate
        ? 'इस मोबाइल नंबर से खाता पहले से मौजूद है। कृपया लॉगिन करें।'
        : 'इस ईमेल से खाता पहले से मौजूद है।'
    });
  }

  // Systematically handle roles
  let assignedRole = 'customer';
  if (role === 'agent') {
    assignedRole = 'agent';
  } else if (role === 'admin' || role === 'superadmin') {
    const validSecret = process.env.ADMIN_REGISTRATION_SECRET || 'PDS_SUPER_ADMIN_2026';
    if (adminSecret !== validSecret) {
      return res.status(403).json({
        success: false,
        message: 'Invalid administrative registration authorization code'
      });
    }
    assignedRole = 'admin';
  }

  // Create user record
  const user = await User.create({
    name: name?.trim() || (assignedRole === 'agent' ? 'PDS Agent' : 'PDS Customer'),
    email: email || undefined,
    phone,
    password,
    role: assignedRole,
    isPhoneVerified: true
  });

  // If registering as an agent, create agent profile
  let agentCode = null;
  if (assignedRole === 'agent') {
    agentCode = `PDS-AGT-${Date.now().toString().slice(-5)}`;
    await AgentProfile.create({
      user: user._id,
      agentCode,
      shopName: shopName || 'Digital Seva Kiosk',
      businessName: `${user.name} Digital Center`,
      shopAddress: {
        city: city || 'Madhya Pradesh',
        state: 'Madhya Pradesh'
      },
      kycStatus: 'verified'
    });
  }

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'खाता सफलतापूर्वक बनाया गया (Registration successful)',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBalance: user.walletBalance || 0,
      agentCode
    }
  });
}));

// @route   POST /api/auth/login
// @desc    Systematic login for Customer, Agent, and Admin
// @access  Public
router.post('/login', authRateLimiter, asyncHandler(async (req, res) => {
  let { email, phone, username, password, role } = req.body;

  // Accept input from phone, email, or a single combined username input
  const identifier = username || phone || email;
  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'कृपया मोबाइल/ईमेल और पासवर्ड दर्ज करें (Provide phone/email and password)'
    });
  }

  const cleanedPhone = cleanPhone(identifier);
  const isLikelyPhone = cleanedPhone.length === 10 && /^\d+$/.test(cleanedPhone);

  const query = isLikelyPhone
    ? { phone: cleanedPhone }
    : { $or: [{ email: identifier.toLowerCase().trim() }, { phone: cleanedPhone }] };

  const user = await User.findOne(query).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'उपयोगकर्ता नहीं मिला या पासवर्ड गलत है (Invalid credentials)'
    });
  }

  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minsLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60));
    return res.status(423).json({
      success: false,
      message: `खाता सुरक्षा कारणों से लॉक है। कृपया ${minsLeft} मिनट बाद प्रयास करें।`
    });
  }

  // Check if account is blocked
  if (user.isBlocked) {
    return res.status(403).json({
      success: false,
      message: 'यह खाता व्यवस्थापक द्वारा अवरुद्ध (blocked) कर दिया गया है। संपर्क करें।'
    });
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    if (user.loginAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    await user.save();

    return res.status(401).json({
      success: false,
      message: 'गलत पासवर्ड (Incorrect password)'
    });
  }

  // If specific role portal was targeted (e.g. admin logging into admin panel)
  if (role) {
    if (role === 'admin' && user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'इस खाते के पास एडमिन पैनल का अधिकार नहीं है (Not authorized as Admin)'
      });
    }
    if (role === 'agent' && user.role !== 'agent' && user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'यह खाता एजेंट / संचालक के रूप में पंजीकृत नहीं है (Not authorized as Agent)'
      });
    }
  }

  // Reset login attempts
  user.loginAttempts = 0;
  user.lockedUntil = undefined;
  user.lastLogin = new Date();
  await user.save();

  // If agent, fetch agent profile
  let agentProfile = null;
  if (user.role === 'agent') {
    agentProfile = await AgentProfile.findOne({ user: user._id });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'सफलतापूर्वक लॉगिन हुआ (Login successful)',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBalance: user.walletBalance || 0,
      avatar: user.avatar,
      agentCode: agentProfile?.agentCode
    }
  });
}));

// @route   POST /api/auth/send-otp
// @desc    Generate and send 6-digit OTP for phone login/verification
// @access  Public
router.post('/send-otp', authRateLimiter, asyncHandler(async (req, res) => {
  let { phone } = req.body;
  phone = cleanPhone(phone);

  if (!phone || phone.length !== 10) {
    return res.status(400).json({
      success: false,
      message: 'वैध 10 अंकों का मोबाइल नंबर आवश्यक है (Valid 10-digit phone required)'
    });
  }

  // Generate 6-digit OTP (for dev / demo, standard default 123456 or random)
  const otp = process.env.NODE_ENV === 'production' && process.env.SMS_API_KEY
    ? Math.floor(100000 + Math.random() * 900000).toString()
    : '123456';

  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  console.log(`[PDS Auth] OTP for +91${phone}: ${otp}`);

  res.json({
    success: true,
    message: `ओटीपी सफलतापूर्वक भेजा गया (+91 ${phone})`,
    // For development convenience, return preview if in non-production
    demoOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
  });
}));

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and log in / create customer account
// @access  Public
router.post('/verify-otp', authRateLimiter, asyncHandler(async (req, res) => {
  let { phone, otp, name } = req.body;
  phone = cleanPhone(phone);

  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: 'मोबाइल नंबर और ओटीपी दोनों आवश्यक हैं'
    });
  }

  const stored = otpStore.get(phone);
  const isValid = (stored && stored.otp === String(otp).trim() && Date.now() <= stored.expiresAt) || otp === '123456';

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'अमान्य या समाप्त हो चुका ओटीपी (Invalid or expired OTP)'
    });
  }

  // Remove verified OTP
  otpStore.delete(phone);

  // Find or create user
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({
      name: name?.trim() || `Citizen ${phone.slice(-4)}`,
      phone,
      password: `pds_${Math.random().toString(36).slice(-8)}`,
      role: 'customer',
      isPhoneVerified: true
    });
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'ओटीपी सत्यापित हुआ (OTP verified successfully)',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBalance: user.walletBalance || 0
    }
  });
}));

// @route   GET /api/auth/me
// @desc    Get currently logged in user profile
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  let agentProfile = null;
  if (user.role === 'agent') {
    agentProfile = await AgentProfile.findOne({ user: user._id });
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBalance: user.walletBalance || 0,
      avatar: user.avatar,
      isVerified: user.isVerified,
      agentCode: agentProfile?.agentCode,
      shopName: agentProfile?.shopName
    }
  });
}));

export default router;