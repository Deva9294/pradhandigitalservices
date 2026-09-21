import express from 'express';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { serviceId, formData, documents, notes } = req.body;
  
  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  const booking = await Booking.create({
    user: req.user.id,
    service: serviceId,
    serviceName: service.name,
    formData,
    documents: documents || [],
    notes,
    payment: {
      amount: service.price,
      status: 'pending'
    }
  });
  
  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    booking
  });
}));

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const { status } = req.query;
  
  let query = { user: req.user.id };
  if (status) {
    query.status = status;
  }
  
  const bookings = await Booking.find(query)
    .populate('service', 'name icon category')
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: bookings.length,
    bookings
  });
}));

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('service')
    .populate('user', 'name email phone');
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }
  
  // Check ownership
  if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  }
  
  res.json({
    success: true,
    booking
  });
}));

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const { status, adminNotes, rejectionReason } = req.body;
  
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }
  
  booking.status = status;
  booking.adminNotes = adminNotes;
  booking.rejectionReason = rejectionReason;
  
  if (status === 'completed') {
    booking.completedAt = new Date();
  } else if (status === 'cancelled' || status === 'rejected') {
    booking.cancelledAt = new Date();
  }
  
  await booking.save();
  
  res.json({
    success: true,
    message: 'Booking status updated',
    booking
  });
}));

export default router;
