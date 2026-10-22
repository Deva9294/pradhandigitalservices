import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

const router = express.Router();

const rechargeProviders = {
  mobile: [
    { id: 'jio', name: 'Reliance Jio', logo: '🟣', circle: 'Madhya Pradesh & Chhattisgarh' },
    { id: 'airtel', name: 'Bharti Airtel', logo: '🔴', circle: 'Madhya Pradesh & Chhattisgarh' },
    { id: 'vi', name: 'Vodafone Idea (Vi)', logo: '🟡', circle: 'Madhya Pradesh & Chhattisgarh' },
    { id: 'bsnl', name: 'BSNL Mobile (3G/4G)', logo: '🔵', circle: 'Madhya Pradesh & Chhattisgarh' }
  ],
  dth: [
    { id: 'tatasky', name: 'Tata Play (Tata Sky)', logo: '📺' },
    { id: 'airteldth', name: 'Airtel Digital TV', logo: '📡' },
    { id: 'dish', name: 'Dish TV India', logo: '🛰️' },
    { id: 'd2h', name: 'Videocon D2H', logo: '📺' },
    { id: 'sundirect', name: 'Sun Direct', logo: '☀️' }
  ],
  electricity: [
    { id: 'mppkvvcl_central', name: 'MPPKVVCL - Bhopal & Central MP (मध्य क्षेत्र विद्युत)', state: 'MP' },
    { id: 'mppkvvcl_west', name: 'MPPKVVCL - Indore & West MP (पश्चिम क्षेत्र विद्युत)', state: 'MP' },
    { id: 'mppoorv', name: 'MP Poorv Kshetra - Jabalpur (पूर्व क्षेत्र विद्युत)', state: 'MP' },
    { id: 'uppcl', name: 'UPPCL (Urban / Rural)', state: 'UP' }
  ],
  water: [
    { id: 'mp_urban_water', name: 'Bhopal / Sehore Municipal Corporation Water Tax', state: 'MP' },
    { id: 'indore_water', name: 'Indore Municipal Corporation (IMC) Jal Kar', state: 'MP' }
  ],
  gas: [
    { id: 'indane', name: 'Indane Gas (Indian Oil)', type: 'LPG' },
    { id: 'hp', name: 'HP Gas (Hindustan Petroleum)', type: 'LPG' },
    { id: 'bharat', name: 'Bharat Gas (BPCL)', type: 'LPG' },
    { id: 'avantika', name: 'Avantika Gas Limited (MP PNG)', type: 'PNG' }
  ],
  fastag: [
    { id: 'sbi_fastag', name: 'State Bank of India FASTag' },
    { id: 'paytm_fastag', name: 'ICICI / IDFC / Bank FASTag' },
    { id: 'airtel_fastag', name: 'Airtel Payments Bank FASTag' }
  ],
  broadband: [
    { id: 'jio_fiber', name: 'JioFiber / AirFiber' },
    { id: 'airtel_xstream', name: 'Airtel Xstream Fiber' },
    { id: 'bsnl_ftth', name: 'BSNL Bharat Fiber (FTTH)' }
  ],
  creditcard: [
    { id: 'sbi_card', name: 'SBI Credit Card' },
    { id: 'hdfc_card', name: 'HDFC Bank Credit Card' },
    { id: 'icici_card', name: 'ICICI Bank Credit Card' },
    { id: 'axis_card', name: 'Axis Bank Credit Card' }
  ]
};

const planDatabase = {
  jio: [
    { id: 'jio-1', name: '₹198 Hero Plan', amount: 198, validity: '14 Days', data: '2GB/Day', category: 'Popular', description: 'Unlimited Voice Calls + 100 SMS/Day + JioTV & Cloud' },
    { id: 'jio-2', name: '₹349 Unlimited 5G', amount: 349, validity: '28 Days', data: '2GB/Day', category: 'True 5G', description: 'Unlimited 5G Data + Unlimited Calls + 100 SMS/Day' },
    { id: 'jio-3', name: '₹399 Extra Data Pack', amount: 399, validity: '28 Days', data: '2.5GB/Day', category: 'True 5G', description: 'Unlimited 5G + 2.5GB 4G/day + Unlimited Calls' },
    { id: 'jio-4', name: '₹899 90-Days Pack', amount: 899, validity: '90 Days', data: '2GB/Day + 20GB Extra', category: 'Popular', description: 'Unlimited 5G Data + Unlimited Voice for 3 Months' },
    { id: 'jio-5', name: '₹3599 Annual Pack', amount: 3599, validity: '365 Days', data: '2.5GB/Day', category: 'Annual', description: '365 Days Unlimited 5G + Unlimited Calls' },
    { id: 'jio-6', name: '₹29 Booster Data', amount: 29, validity: 'Active Plan', data: '2GB High Speed', category: 'Data Add-on', description: 'Instant 2GB 4G Data Booster' }
  ],
  airtel: [
    { id: 'air-1', name: '₹199 Starter Pack', amount: 199, validity: '28 Days', data: '2GB Total', category: 'Popular', description: 'Unlimited Calls + 100 SMS/Day' },
    { id: 'air-2', name: '₹379 Unlimited 5G', amount: 379, validity: '1 Month', data: '2GB/Day', category: 'True 5G', description: 'Unlimited 5G Data + Unlimited Calling + Apollo 24/7' },
    { id: 'air-3', name: '₹579 Super Saver', amount: 579, validity: '56 Days', data: '1.5GB/Day', category: 'Popular', description: 'Unlimited Calls + 100 SMS/day + Free HelloTunes' },
    { id: 'air-4', name: '₹979 84-Days Pack', amount: 979, validity: '84 Days', data: '2GB/Day + 5G', category: 'Popular', description: 'Unlimited 5G + Airtel Xstream Play Access' },
    { id: 'air-5', name: '₹3599 1-Year Plan', amount: 3599, validity: '365 Days', data: '2GB/Day', category: 'Annual', description: 'Full 1 Year validity + Unlimited 5G + Disney+ Hotstar' }
  ],
  vi: [
    { id: 'vi-1', name: '₹299 Hero Unlimited', amount: 299, validity: '28 Days', data: '1.5GB/Day', category: 'Popular', description: 'Binge All Night (12AM-6AM) + Weekend Data Rollover' },
    { id: 'vi-2', name: '₹349 Unlimited 5G', amount: 349, validity: '28 Days', data: '1.5GB/Day', category: 'Popular', description: 'Truly Unlimited Calls + Vi Movies & TV' },
    { id: 'vi-3', name: '₹719 84-Days Pack', amount: 719, validity: '84 Days', data: '1.5GB/Day', category: 'Popular', description: '84 Days Validity with Unlimited Calls and Rollover' }
  ],
  bsnl: [
    { id: 'bsnl-1', name: '₹108 Special Voice', amount: 108, validity: '28 Days', data: '1GB/Day', category: 'Popular', description: 'Unlimited Voice Calls + 100 SMS/Day' },
    { id: 'bsnl-2', name: '₹199 Best Value', amount: 199, validity: '30 Days', data: '2GB/Day', category: 'Popular', description: '30 Days Unlimited Calling + 2GB Daily Data' },
    { id: 'bsnl-3', name: '₹397 Long Validity', amount: 397, validity: '150 Days', data: '2GB/Day (First 30 days)', category: 'Annual', description: '150 Days SIM Active Validity with Free Incoming' },
    { id: 'bsnl-4', name: '₹1999 365-Days Pack', amount: 1999, validity: '365 Days', data: '600GB High Speed', category: 'Annual', description: 'Full 1 Year Validity + Unlimited Voice Calling' }
  ]
};

// @route   GET /api/recharge/providers
router.get('/providers', asyncHandler(async (req, res) => {
  const { type } = req.query;
  if (type && rechargeProviders[type]) {
    return res.json({ success: true, providers: rechargeProviders[type] });
  }
  res.json({ success: true, providers: rechargeProviders });
}));

// @route   GET /api/recharge/plans
router.get('/plans', asyncHandler(async (req, res) => {
  const { provider = 'jio' } = req.query;
  const p = String(provider).toLowerCase();
  const plans = planDatabase[p] || planDatabase.jio;
  res.json({ success: true, provider: p, plans });
}));

// Helper to record payment & create transaction receipt
async function recordTransaction(req, { type, amount, targetNumber, provider, description }) {
  const receiptNumber = `REC-PDS-${Date.now().toString().slice(-6)}`;
  const operatorTxnId = `OPR${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
  const bbpsRef = `BBPS${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  let user = null;
  if (req.user) {
    user = await User.findById(req.user._id || req.user.id);
  }

  // Create payment entry
  let payment = null;
  try {
    payment = await Payment.create({
      paymentId: `PAY_${Date.now()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      user: user ? user._id : undefined,
      type: 'recharge',
      amount,
      currency: 'INR',
      feeBreakdown: {
        governmentFee: 0,
        portalFee: 0,
        gatewayFee: 0,
        tax: 0,
        discount: 0,
        total: amount
      },
      gateway: 'manual',
      gatewayTransactionId: operatorTxnId,
      status: 'completed',
      initiatedAt: new Date(),
      completedAt: new Date()
    });
  } catch (err) {
    console.warn('[Recharge] Payment record notice:', err.message);
  }

  return {
    receiptNumber,
    operatorTxnId,
    bbpsRef,
    type,
    amount,
    targetNumber,
    provider,
    description,
    status: 'SUCCESS',
    timestamp: new Date().toISOString(),
    paymentId: payment?.paymentId || `PAY_${Date.now()}`,
    serviceCharge: '₹0 (Free Digital Seva)',
    supportPhone: '+91 9294899787',
    kioskName: 'Pradhan Digital Services (Rehti, Sehore, MP)'
  };
}

// @route   POST /api/recharge/mobile
router.post('/mobile', optionalAuth, asyncHandler(async (req, res) => {
  const { phoneNumber, provider, amount, plan } = req.body;
  const cleanPhone = String(phoneNumber || '').replace(/\D/g, '').slice(-10);

  if (cleanPhone.length !== 10) {
    return res.status(400).json({ success: false, message: 'वैध 10 अंकों का मोबाइल नंबर दर्ज करें (Valid 10-digit mobile required)' });
  }

  const parsedAmount = Number(amount);
  if (!parsedAmount || parsedAmount < 10 || parsedAmount > 15000) {
    return res.status(400).json({ success: false, message: 'वैध रिचार्ज राशि दर्ज करें (₹10 - ₹15,000)' });
  }

  const receipt = await recordTransaction(req, {
    type: 'Mobile Recharge',
    amount: parsedAmount,
    targetNumber: cleanPhone,
    provider: provider || 'Prepaid',
    description: plan ? `Recharge Plan: ${plan}` : `Mobile Recharge of ₹${parsedAmount}`
  });

  res.json({
    success: true,
    message: `+91 ${cleanPhone} पर ₹${parsedAmount} का रिचार्ज सफलतापूर्वक संपन्न हुआ!`,
    data: receipt
  });
}));

// @route   POST /api/recharge/dth
router.post('/dth', optionalAuth, asyncHandler(async (req, res) => {
  const { customerId, provider, amount } = req.body;
  const cleanId = String(customerId || '').trim();

  if (!cleanId || cleanId.length < 5) {
    return res.status(400).json({ success: false, message: 'वैध DTH ग्राहक आईडी/स्मार्ट कार्ड नंबर दर्ज करें' });
  }

  const parsedAmount = Number(amount);
  if (!parsedAmount || parsedAmount < 50 || parsedAmount > 10000) {
    return res.status(400).json({ success: false, message: 'राशि ₹50 से ₹10,000 के बीच होनी चाहिए' });
  }

  const receipt = await recordTransaction(req, {
    type: 'DTH Recharge',
    amount: parsedAmount,
    targetNumber: cleanId,
    provider: provider || 'DTH Service',
    description: `DTH Recharge for VC/Customer ID: ${cleanId}`
  });

  res.json({
    success: true,
    message: `DTH खाता (${cleanId}) पर ₹${parsedAmount} का रिचार्ज सफलतापूर्वक हुआ!`,
    data: receipt
  });
}));

// @route   POST /api/recharge/bill
// @desc    Process Electricity, Water, Gas, FASTag, Broadband, Credit Card bills
router.post('/bill', optionalAuth, asyncHandler(async (req, res) => {
  const { service, accountNumber, amount, billerId } = req.body;
  const cleanAccount = String(accountNumber || '').trim();

  if (!cleanAccount || cleanAccount.length < 3) {
    return res.status(400).json({ success: false, message: 'कृपया वैध उपभोक्ता क्रमांक / खाता संख्या दर्ज करें' });
  }

  const parsedAmount = Number(amount);
  if (!parsedAmount || parsedAmount < 1) {
    return res.status(400).json({ success: false, message: 'कृपया वैध भुगतान राशि दर्ज करें' });
  }

  const serviceNames = {
    electricity: 'बिजली बिल भुगतान (Electricity Bill)',
    water: 'जल कर भुगतान (Water Tax)',
    gas: 'LPG सिलेंडर / गैस बिल (Gas Booking)',
    fastag: 'FASTag टोल रिचार्ज (FASTag Recharge)',
    broadband: 'ब्रॉडबैंड / फाइबर बिल (Broadband)',
    creditcard: 'क्रेडिट कार्ड बिल (Credit Card Bill)'
  };

  const receipt = await recordTransaction(req, {
    type: serviceNames[service] || 'Utility Bill Payment',
    amount: parsedAmount,
    targetNumber: cleanAccount,
    provider: billerId || service,
    description: `${serviceNames[service] || 'Bill Payment'} - A/C: ${cleanAccount}`
  });

  res.json({
    success: true,
    message: `${serviceNames[service] || 'बिल'} भुगतान ₹${parsedAmount} सफलतापूर्वक संपन्न हुआ! रसीद तैयार है।`,
    data: receipt
  });
}));

export default router;
