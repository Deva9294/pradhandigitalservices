import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

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

// Live recharge / BBPS execution is intentionally disabled until a certified provider API is configured.
// The frontend can collect Razorpay payments, but this API must never fabricate a successful recharge.
const providerUnavailable = (req, res) => res.status(503).json({
  success: false,
  message: 'Live recharge / BBPS provider integration is not configured. No recharge or bill payment has been processed.'
});

router.post('/mobile', asyncHandler(async (req, res) => providerUnavailable(req, res)));
router.post('/dth', asyncHandler(async (req, res) => providerUnavailable(req, res)));
router.post('/bill', asyncHandler(async (req, res) => providerUnavailable(req, res)));

export default router;
