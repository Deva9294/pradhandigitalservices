import express from 'express';
import Service from '../models/Service.js';
import ServiceCategory from '../models/ServiceCategory.js';
import DocumentType from '../models/DocumentType.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/services/categories
// @desc    Get all active service categories
// @access  Public
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await ServiceCategory.find({ isActive: true }).sort({ order: 1, name: 1 });
  
  // Also calculate active service counts per category
  const counts = await Service.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  const countMap = {};
  counts.forEach(c => { countMap[c._id] = c.count; });

  const categoriesWithCount = categories.map(cat => ({
    ...cat.toObject(),
    serviceCount: countMap[cat.slug] || 0
  }));

  res.json({
    success: true,
    count: categoriesWithCount.length,
    categories: categoriesWithCount
  });
}));

// @route   GET /api/services/document-types
// @desc    Get all master document types
// @access  Public
router.get('/document-types', asyncHandler(async (req, res) => {
  const documentTypes = await DocumentType.find({ isActive: true }).sort({ order: 1, name: 1 });
  res.json({
    success: true,
    count: documentTypes.length,
    documentTypes
  });
}));

// @route   GET /api/services
// @desc    Get all services with optional search and filters
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { category, search, popular, subcategory } = req.query;
  
  let query = { isActive: true };
  
  if (category) {
    query.category = category;
  }

  if (subcategory) {
    query.subcategory = subcategory;
  }
  
  if (popular === 'true') {
    query.isPopular = true;
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { nameHi: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { descriptionHi: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }
  
  const services = await Service.find(query).sort({ order: 1, isPopular: -1, name: 1 });
  
  res.json({
    success: true,
    count: services.length,
    services
  });
}));

// @route   GET /api/services/:slug
// @desc    Get single service by slug
// @access  Public
router.get('/:slug', asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isActive: true })
    .populate('documentRequirements.documentType');
  
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  res.json({
    success: true,
    service
  });
}));

// @route   POST /api/services
// @desc    Create a new service (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    service
  });
}));

// @route   PUT /api/services/:id
// @desc    Update service (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Service updated successfully',
    service
  });
}));

// @route   DELETE /api/services/:id
// @desc    Delete service (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Service deleted successfully'
  });
}));

export default router;
