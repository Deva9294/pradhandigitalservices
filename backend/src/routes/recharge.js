import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Mock recharge data (in production, integrate with actual recharge APIs)
const rechargeProviders = {
  mobile: [
    { id: 'jio', name: 'Jio', logo: '/logos/jio.png' },
    { id: 'airtel', name: 'Airtel', logo: '/logos/airtel.png' },
    { id: 'vi', name: 'Vi', logo: '/logos/vi.png' },
    { id: 'bsnl', name: 'BSNL', logo: '/logos/bsnl.png' }
  ],
  dth: [
    { id: 'tatasky', name: 'Tata Sky', logo: '/logos/tatasky.png' },
    { id: 'airteldth', name: 'Airtel DTH', logo: '/logos/airteldth.png' },
    { id: 'dish', name: 'Dish TV', logo: '/logos/dish.png' },
    { id: 'd2h', name: 'D2H', logo: '/logos/d2h.png' }
  ]
};

// @route   GET /api/recharge/providers
// @desc    Get recharge providers
// @access  Public
router.get('/providers', asyncHandler(async (req, res) => {
  const { type } = req.query;
  
  if (type && rechargeProviders[type]) {
    res.json({
      success: true,
      providers: rechargeProviders[type]
    });
  } else {
    res.json({
      success: true,
      providers: rechargeProviders
    });
  }
}));

// @route   POST /api/recharge/mobile
// @desc    Recharge mobile
// @access  Private
router.post('/mobile', protect, asyncHandler(async (req, res) => {
  const { phoneNumber, provider, amount, plan } = req.body;
  
  // Validate phone number (10 digits)
  if (!/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number'
    });
  }
  
  // Validate amount
  if (amount < 10 || amount > 10000) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be between ₹10 and ₹10,000'
    });
  }
  
  // In production, integrate with actual recharge API
  // For now, return success response
  res.json({
    success: true,
    message: 'Recharge initiated successfully',
    data: {
      transactionId: `TXN${Date.now()}`,
      phoneNumber,
      provider,
      amount,
      status: 'processing',
      estimatedTime: '2-5 minutes'
    }
  });
}));

// @route   POST /api/recharge/dth
// @desc    Recharge DTH
// @access  Private
router.post('/dth', protect, asyncHandler(async (req, res) => {
  const { customerId, provider, amount, plan } = req.body;
  
  // Validate customer ID
  if (!customerId || customerId.length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Invalid customer ID'
    });
  }
  
  // Validate amount
  if (amount < 50 || amount > 5000) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be between ₹50 and ₹5,000'
    });
  }
  
  res.json({
    success: true,
    message: 'DTH recharge initiated successfully',
    data: {
      transactionId: `TXN${Date.now()}`,
      customerId,
      provider,
      amount,
      status: 'processing',
      estimatedTime: '5-10 minutes'
    }
  });
}));

// @route   GET /api/recharge/plans
// @desc    Get recharge plans
// @access  Public
router.get('/plans', asyncHandler(async (req, res) => {
  const { provider, type } = req.query;
  
  // Mock plans data
  const plans = [
    { id: 1, name: '₹199 Plan', amount: 199, validity: '28 days', data: '1.5GB/day' },
    { id: 2, name: '₹299 Plan', amount: 299, validity: '28 days', data: '2GB/day' },
    { id: 3, name: '₹499 Plan', amount: 499, validity: '56 days', data: '2GB/day' },
    { id: 4, name: '₹599 Plan', amount: 599, validity: '84 days', data: '1.5GB/day' },
    { id: 5, name: '₹799 Plan', amount: 799, validity: '56 days', data: '2.5GB/day' }
  ];
  
  res.json({
    success: true,
    plans
  });
}));

export default router;
