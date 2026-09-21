import ServiceApplication from '../models/ServiceApplication.js';
import ApplicationDocument from '../models/ApplicationDocument.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const createApplication = catchAsync(async (req, res) => {
  const {
    serviceId,
    applicantDetails,
    serviceData,
    paymentMethod = 'online'
  } = req.body;

  // Validate service
  const service = await Service.findById(serviceId);
  if (!service) throw new AppError('Service not found', 404);
  if (!service.isActive) throw new AppError('Service is not active', 400);

  // Calculate fees
  const governmentFee = service.price || 0;
  const portalFee = Math.round(governmentFee * 0.10); // 10% portal fee
  const total = governmentFee + portalFee;

  const application = await ServiceApplication.create({
    user: req.user._id,
    service: serviceId,
    applicantDetails,
    serviceData,
    payment: {
      amount: total,
      governmentFee,
      portalFee,
      totalAmount: total,
      paymentMethod,
      status: 'pending'
    },
    feeBreakdown: {
      governmentFee,
      assistanceCharge: portalFee,
      convenienceFee: 0,
      tax: 0,
      total
    },
    status: 'draft',
    processingDetails: {
      submittedAt: new Date()
    },
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    data: application
  });
});

export const getMyApplications = catchAsync(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const applications = await ServiceApplication.find(filter)
    .populate('service', 'name slug icon')
    .sort('-createdAt');

  res.json({ success: true, data: applications });
});

export const getApplication = catchAsync(async (req, res) => {
  const application = await ServiceApplication.findById(req.params.id)
    .populate('service')
    .populate('user', 'name phone email')
    .populate('agent', 'name phone')
    .populate('documents');

  if (!application) throw new AppError('Application not found', 404);

  // Check authorization
  const isOwner = String(application.user._id) === String(req.user._id);
  const isAgent = application.agent && String(application.agent) === String(req.user._id);
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

  if (!isOwner && !isAgent && !isAdmin) {
    throw new AppError('Not authorized', 403);
  }

  res.json({ success: true, data: application });
});

export const updateApplication = catchAsync(async (req, res) => {
  const application = await ServiceApplication.findById(req.params.id);
  if (!application) throw new AppError('Application not found', 404);

  // Check authorization
  const isOwner = String(application.user) === String(req.user._id);
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

  if (!isOwner && !isAdmin) {
    throw new AppError('Not authorized', 403);
  }

  // Only allow updates on draft status
  if (application.status !== 'draft' && !isAdmin) {
    throw new AppError('Cannot update submitted application', 400);
  }

  const allowed = ['applicantDetails', 'serviceData', 'customerNotes'];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const updated = await ServiceApplication.findByIdAndUpdate(
    req.params.id,
    { ...updates, updatedBy: req.user._id },
    { new: true }
  );

  res.json({ success: true, data: updated });
});

export const uploadDocument = catchAsync(async (req, res) => {
  const application = await ServiceApplication.findById(req.params.id);
  if (!application) throw new AppError('Application not found', 404);

  // Check authorization
  const isOwner = String(application.user) === String(req.user._id);
  const isAgent = application.agent && String(application.agent) === String(req.user._id);
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

  if (!isOwner && !isAgent && !isAdmin) {
    throw new AppError('Not authorized', 403);
  }

  if (!req.file) throw new AppError('No file uploaded', 400);

  const { documentType, fileName } = req.body;
  if (!documentType) throw new AppError('Document type is required', 400);

  // In production, upload to cloud storage
  const fileUrl = `/uploads/${req.file.filename}`;

  const document = await ApplicationDocument.create({
    application: application._id,
    documentType,
    fileName: fileName || req.file.originalname,
    fileUrl,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    uploadedBy: req.user._id
  });

  // Add to application documents
  application.documents.push({
    type: documentType,
    url: fileUrl,
    fileName: fileName || req.file.originalname,
    uploadedAt: new Date()
  });

  await application.save();

  res.status(201).json({ success: true, data: document });
});

export const deleteDocument = catchAsync(async (req, res) => {
  const application = await ServiceApplication.findById(req.params.id);
  if (!application) throw new AppError('Application not found', 404);

  // Check authorization
  const isOwner = String(application.user) === String(req.user._id);
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

  if (!isOwner && !isAdmin) {
    throw new AppError('Not authorized', 403);
  }

  const document = await ApplicationDocument.findById(req.params.documentId);
  if (!document) throw new AppError('Document not found', 404);

  if (String(document.application) !== String(application._id)) {
    throw new AppError('Document does not belong to this application', 400);
  }

  await document.delete();

  // Remove from application documents
  application.documents = application.documents.filter(
    (doc) => String(doc._id) !== String(req.params.documentId)
  );
  await application.save();

  res.json({ success: true, message: 'Document deleted successfully' });
});

export const updateStatus = catchAsync(async (req, res) => {
  const { status, remarks } = req.body;
  const application = await ServiceApplication.findById(req.params.id);
  if (!application) throw new AppError('Application not found', 404);

  // Only admin/agent can update status
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);
  const isAgent = ['agent'].includes(req.user.role);

  if (!isAdmin && !isAgent) {
    throw new AppError('Not authorized', 403);
  }

  // Validate status transition
  const validTransitions = {
    draft: ['submitted', 'cancelled'],
    submitted: ['documents_under_review', 'cancelled'],
    documents_under_review: ['correction_required', 'processing', 'rejected'],
    correction_required: ['submitted', 'cancelled'],
    processing: ['completed', 'rejected'],
    completed: [],
    rejected: [],
    cancelled: []
  };

  if (!validTransitions[application.status]?.includes(status)) {
    throw new AppError(`Invalid status transition from ${application.status} to ${status}`, 400);
  }

  // Add status history
  application.statusHistory.push({
    status,
    remarks: remarks || '',
    changedBy: req.user._id,
    changedAt: new Date()
  });

  application.status = status;
  application.updatedBy = req.user._id;

  if (remarks) {
    application.adminRemarks = remarks;
  }

  if (status === 'submitted') {
    application.processingDetails.submittedAt = new Date();
  } else if (status === 'completed') {
    application.processingDetails.actualCompletionDate = new Date();
  } else if (status === 'cancelled') {
    application.cancellationReason = remarks;
    application.cancelledAt = new Date();
  } else if (status === 'rejected') {
    application.rejectionReason = remarks;
    application.rejectedAt = new Date();
  }

  await application.save();

  res.json({ success: true, data: application });
});

export const addRemarks = catchAsync(async (req, res) => {
  const { remarks, type = 'agent' } = req.body;
  const application = await ServiceApplication.findById(req.params.id);
  if (!application) throw new AppError('Application not found', 404);

  // Check authorization
  const isOwner = String(application.user) === String(req.user._id);
  const isAgent = application.agent && String(application.agent) === String(req.user._id);
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

  if (!isOwner && !isAgent && !isAdmin) {
    throw new AppError('Not authorized', 403);
  }

  if (type === 'agent' && !isAgent && !isAdmin) {
    throw new AppError('Not authorized to add agent remarks', 403);
  }

  if (type === 'agent') {
    application.agentRemarks = remarks;
  } else {
    application.customerNotes = remarks;
  }

  application.updatedBy = req.user._id;
  await application.save();

  res.json({ success: true, data: application });
});

export const trackApplication = catchAsync(async (req, res) => {
  const { applicationId } = req.params;
  const { phone } = req.query;

  const application = await ServiceApplication.findOne({ applicationId })
    .populate('service', 'name slug icon')
    .select('applicationId status service applicantDetails processingDetails statusHistory adminRemarks createdAt');

  if (!application) throw new AppError('Application not found', 404);

  // Verify phone number for security
  if (phone && application.applicantDetails.phone !== phone) {
    throw new AppError('Phone number does not match', 403);
  }

  // Don't expose sensitive data in public tracking
  const publicData = {
    applicationId: application.applicationId,
    status: application.status,
    service: application.service,
    submittedAt: application.processingDetails.submittedAt,
    estimatedCompletionDate: application.processingDetails.estimatedCompletionDate,
    statusHistory: application.statusHistory,
    adminRemarks: application.adminRemarks,
    createdAt: application.createdAt
  };

  res.json({ success: true, data: publicData });
});