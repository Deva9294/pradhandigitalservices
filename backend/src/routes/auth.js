import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/security.js';

const router = express.Router();

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

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authRateLimiter, asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email or phone'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: role || 'user'
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar
    }
  });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authRateLimiter, asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  // Find user
  const user = await User.findOne({ $or: [{ email }, { phone }] }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return res.status(423).json({
      success: false,
      message: 'Account is temporarily locked. Please try again later.'
    });
  }

  // Check if account is blocked
  if (user.isBlocked) {
    return res.status(403).json({
      success: false,
      message: 'Account has been blocked. Please contact support.'
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    // Increment login attempts
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    
    // Lock account after 5 failed attempts
    if (user.loginAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
    }
    
    await user.save();
    
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Reset login attempts on successful login
  user.loginAttempts = 0;
  user.lockedUntil = undefined;
  
  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar
    }
  });
}));

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      address: user.address,
      isVerified: user.isVerified
    }
  });
}));

export default router;
