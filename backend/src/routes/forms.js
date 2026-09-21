import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';

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

// @route   POST /api/forms/submit
// @desc    Submit offline form application
// @access  Private
router.post('/submit', protect, asyncHandler(async (req, res) => {
  const { formId, formData, documents } = req.body;
  
  const form = offlineForms.find(f => f.id === formId);
  if (!form) {
    return res.status(404).json({
      success: false,
      message: 'Form not found'
    });
  }
  
  // Validate required documents
  const missingDocs = form.documentsRequired.filter(
    doc => !documents || !documents.some(d => d.type === doc)
  );
  
  if (missingDocs.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required documents: ${missingDocs.join(', ')}`
    });
  }
  
  // In production, save to database and process
  res.json({
    success: true,
    message: 'Form submitted successfully',
    data: {
      applicationId: `APP${Date.now()}`,
      formId,
      formName: form.name,
      status: 'processing',
      processingTime: form.processingTime,
      estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  });
}));

export default router;
