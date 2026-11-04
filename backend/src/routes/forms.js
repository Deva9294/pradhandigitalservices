import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import OfflineFormSubmission from '../models/OfflineFormSubmission.js';

const router = express.Router();

// Mock offline forms data
const offlineForms = [
  {
    id: 'pan-card',
    name: 'PAN Card Application',
    nameHi: 'पैन कार्ड आवेदन',
    category: 'government',
    description: 'Apply for new PAN card online',
    descriptionHi: 'नया पैन कार्ड ऑनलाइन आवेदन करें',
    price: 150,
    processingTime: '7-10 days',
    documentsRequired: ['Aadhaar Card', 'Passport Size Photo', 'Proof of Address'],
    icon: 'document'
  },
  {
    id: 'aadhaar-update',
    name: 'Aadhaar Update',
    nameHi: 'आधार अपडेट',
    category: 'government',
    description: 'Update your Aadhaar details',
    descriptionHi: 'अपने आधार विवरण अपडेट करें',
    price: 100,
    processingTime: '5-7 days',
    documentsRequired: ['Aadhaar Card', 'Supporting Documents'],
    icon: 'fingerprint'
  },
  {
    id: 'passport',
    name: 'Passport Application',
    nameHi: 'पासपोर्ट आवेदन',
    category: 'government',
    description: 'Apply for new passport or renewal',
    descriptionHi: 'नया पासपोर्ट या नवीनीकरण के लिए आवेदन करें',
    price: 500,
    processingTime: '15-30 days',
    documentsRequired: ['Aadhaar Card', 'Passport Size Photo', 'Address Proof', 'Birth Certificate'],
    icon: 'globe'
  },
  {
    id: 'driving-license',
    name: 'Driving License',
    nameHi: 'ड्राइविंग लाइसेंस',
    category: 'government',
    description: 'Apply for new driving license',
    descriptionHi: 'नया ड्राइविंग लाइसेंस के लिए आवेदन करें',
    price: 300,
    processingTime: '10-15 days',
    documentsRequired: ['Aadhaar Card', 'Passport Size Photo', 'Address Proof', 'Age Proof'],
    icon: 'car'
  },
  {
    id: 'voter-id',
    name: 'Voter ID Card',
    nameHi: 'मतदाता पहचान पत्र',
    category: 'government',
    description: 'Apply for new voter ID card',
    descriptionHi: 'नया मतदाता पहचान पत्र के लिए आवेदन करें',
    price: 50,
    processingTime: '7-14 days',
    documentsRequired: ['Aadhaar Card', 'Passport Size Photo', 'Address Proof'],
    icon: 'vote'
  },
  {
    id: 'birth-certificate',
    name: 'Birth Certificate',
    nameHi: 'जन्म प्रमाण पत्र',
    category: 'government',
    description: 'Get your birth certificate',
    descriptionHi: 'अपना जन्म प्रमाण पत्र प्राप्त करें',
    price: 100,
    processingTime: '5-7 days',
    documentsRequired: ['Birth Proof', 'Parents ID Proof', 'Address Proof'],
    icon: 'baby'
  }
];

// @route   GET /api/forms
// @desc    Get all offline forms
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  
  let filteredForms = offlineForms;
  
  if (category) {
    filteredForms = filteredForms.filter(f => f.category === category);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredForms = filteredForms.filter(f => 
      f.name.toLowerCase().includes(searchLower) ||
      f.nameHi.toLowerCase().includes(searchLower) ||
      f.description.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({
    success: true,
    count: filteredForms.length,
    forms: filteredForms
  });
}));

// @route   GET /api/forms/:id
// @desc    Get single form by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const form = offlineForms.find(f => f.id === req.params.id);
  
  if (!form) {
    return res.status(404).json({
      success: false,
      message: 'Form not found'
    });
  }
  
  res.json({
    success: true,
    form
  });
}));

// @route   GET /api/forms/history
// @desc    Get the signed-in user's saved offline form submissions
// @access  Private
router.get('/history', protect, asyncHandler(async (req, res) => {
  const submissions = await OfflineFormSubmission.find({ user: req.user._id })
    .select('-formData -documents.url')
    .sort('-createdAt')
    .limit(100);
  res.json({ success: true, data: submissions });
}));

// @route   POST /api/forms/submit
// @desc    Validate and persist an offline form application
// @access  Private
router.post('/submit', protect, asyncHandler(async (req, res) => {
  const { formId, formData = {}, documents = [] } = req.body || {};
  const form = offlineForms.find(item => item.id === formId);
  if (!form) throw Object.assign(new Error('Form not found'), { statusCode: 404 });

  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    throw Object.assign(new Error('Applicant form data must be an object.'), { statusCode: 400 });
  }
  if (!Array.isArray(documents) || documents.length > 20) {
    throw Object.assign(new Error('Upload between 0 and 20 valid documents.'), { statusCode: 400 });
  }

  const validDocuments = documents.filter(document =>
    document && typeof document.type === 'string' &&
    typeof document.url === 'string' &&
    /^(https?:\\/\\/|\\/uploads\\/)/i.test(document.url)
  ).map(document => ({
    type: document.type.trim().slice(0, 100),
    url: document.url,
    fileName: typeof document.fileName === 'string' ? document.fileName.slice(0, 180) : ''
  }));

  const missingDocs = form.documentsRequired.filter(required =>
    !validDocuments.some(document => document.type === required)
  );
  if (missingDocs.length) {
    return res.status(400).json({ success: false, message: `Missing required documents: ${missingDocs.join(', ')}` });
  }

  const submission = await OfflineFormSubmission.create({
    user: req.user._id,
    formId: form.id,
    formName: form.name,
    formData,
    documents: validDocuments,
    status: 'submitted',
    processingTime: form.processingTime,
    estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  res.status(201).json({
    success: true,
    message: 'Your form submission has been saved. Our team will review it.',
    data: {
      submissionId: submission.submissionId,
      formId: submission.formId,
      formName: submission.formName,
      status: submission.status,
      processingTime: submission.processingTime,
      estimatedCompletion: submission.estimatedCompletion
    }
  });
}));

export default router;
