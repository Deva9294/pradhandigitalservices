import User from '../models/User.js';
import Service from '../models/Service.js';
import ServiceApplication from '../models/ServiceApplication.js';
import Vacancy from '../models/Vacancy.js';
import DownloadForm from '../models/DownloadForm.js';
import Payment from '../models/Payment.js';
import SupportTicket from '../models/SupportTicket.js';
import SiteSettings from '../models/SiteSettings.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

// Analytics
export const getAnalytics = catchAsync(async (req, res) => {
  const userCount = await User.countDocuments({ isActive: true });
  const agentCount = await User.countDocuments({ role: 'agent', isActive: true });
  const applicationCount = await ServiceApplication.countDocuments();
  const pendingApplications = await ServiceApplication.countDocuments({ status: 'submitted' });
  const paymentCount = await Payment.countDocuments({ status: 'completed' });
  const revenue = await Payment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const ticketCount = await SupportTicket.countDocuments({ status: 'open' });

  const vacancyCount = await Vacancy.countDocuments({ status: 'active' });
  const formCount = await DownloadForm.countDocuments({ isActive: true });

  // Recent activity
  const recentApplications = await ServiceApplication.find()
    .populate('user', 'name')
    .populate('service', 'name')
    .sort('-createdAt')
    .limit(5);

  const recentPayments = await Payment.find({ status: 'completed' })
    .populate('user', 'name')
    .sort('-createdAt')
    .limit(5);

  res.json({
    success: true,
    data: {
      overview: {
        users: userCount,
        agents: agentCount,
        applications: applicationCount,
        pendingApplications,
        payments: paymentCount,
        revenue: revenue[0]?.total || 0,
        openTickets: ticketCount,
        vacancies: vacancyCount,
        forms: formCount
      },
      recent: {
        applications: recentApplications,
        payments: recentPayments
      }
    }
  });
});

// User Management
export const getUsers = catchAsync(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { phone: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const users = await User.find(filter)
    .select('-password -otp -refreshToken')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    data: users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

export const getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -otp -refreshToken');
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, data: user });
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true, runValidators: true }
  ).select('-password -otp -refreshToken');

  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, data: user });
});

export const deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false, updatedBy: req.user._id },
    { new: true }
  );

  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, message: 'User deactivated successfully' });
});

// Service Management
export const getServices = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const services = await Service.find(filter).sort('-createdAt');
  res.json({ success: true, data: services });
});

export const createService = catchAsync(async (req, res) => {
  const service = await Service.create({
    ...req.body,
    createdBy: req.user._id
  });
  res.status(201).json({ success: true, data: service });
});

export const updateService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true, runValidators: true }
  );
  if (!service) throw new AppError('Service not found', 404);
  res.json({ success: true, data: service });
});

export const deleteService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { isActive: false, updatedBy: req.user._id },
    { new: true }
  );
  if (!service) throw new AppError('Service not found', 404);
  res.json({ success: true, message: 'Service deactivated successfully' });
});

// Application Management
export const getApplications = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.agent) filter.agent = req.query.agent;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const applications = await ServiceApplication.find(filter)
    .populate('user', 'name phone email')
    .populate('agent', 'name phone')
    .populate('service', 'name')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await ServiceApplication.countDocuments(filter);

  res.json({
    success: true,
    data: applications,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

export const getApplication = catchAsync(async (req, res) => {
  const application = await ServiceApplication.findById(req.params.id)
    .populate('user', 'name phone email')
    .populate('agent', 'name phone')
    .populate('service')
    .populate('documents');
  if (!application) throw new AppError('Application not found', 404);
  res.json({ success: true, data: application });
});

export const updateApplicationStatus = catchAsync(async (req, res) => {
  const { status, remarks } = req.body;
  const application = await ServiceApplication.findById(req.params.id);
  if (!application) throw new AppError('Application not found', 404);

  application.statusHistory.push({
    status,
    remarks: remarks || '',
    changedBy: req.user._id,
    changedAt: new Date()
  });

  application.status = status;
  application.adminRemarks = remarks;
  application.updatedBy = req.user._id;

  if (status === 'completed') {
    application.processingDetails.actualCompletionDate = new Date();
  }

  await application.save();
  res.json({ success: true, data: application });
});

// Vacancy Management
export const getVacancies = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.department) filter.department = { $regex: req.query.department, $options: 'i' };

  const vacancies = await Vacancy.find(filter).sort('-createdAt');
  res.json({ success: true, data: vacancies });
});

export const createVacancy = catchAsync(async (req, res) => {
  const vacancy = await Vacancy.create({
    ...req.body,
    createdBy: req.user._id
  });
  res.status(201).json({ success: true, data: vacancy });
});

export const updateVacancy = catchAsync(async (req, res) => {
  const vacancy = await Vacancy.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true, runValidators: true }
  );
  if (!vacancy) throw new AppError('Vacancy not found', 404);
  res.json({ success: true, data: vacancy });
});

export const deleteVacancy = catchAsync(async (req, res) => {
  const vacancy = await Vacancy.findByIdAndUpdate(
    req.params.id,
    { isActive: false, updatedBy: req.user._id },
    { new: true }
  );
  if (!vacancy) throw new AppError('Vacancy not found', 404);
  res.json({ success: true, message: 'Vacancy deactivated successfully' });
});

// Form Management
export const getForms = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const forms = await DownloadForm.find(filter).sort('-createdAt');
  res.json({ success: true, data: forms });
});

export const createForm = catchAsync(async (req, res) => {
  const form = await DownloadForm.create({
    ...req.body,
    createdBy: req.user._id
  });
  res.status(201).json({ success: true, data: form });
});

export const updateForm = catchAsync(async (req, res) => {
  const form = await DownloadForm.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true, runValidators: true }
  );
  if (!form) throw new AppError('Form not found', 404);
  res.json({ success: true, data: form });
});

export const deleteForm = catchAsync(async (req, res) => {
  const form = await DownloadForm.findByIdAndUpdate(
    req.params.id,
    { isActive: false, updatedBy: req.user._id },
    { new: true }
  );
  if (!form) throw new AppError('Form not found', 404);
  res.json({ success: true, message: 'Form deactivated successfully' });
});

// Payment Management
export const getPayments = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.gateway) filter.gateway = req.query.gateway;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const payments = await Payment.find(filter)
    .populate('user', 'name email')
    .populate('agent', 'name')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments(filter);

  res.json({
    success: true,
    data: payments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

export const getPayment = catchAsync(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('user', 'name email')
    .populate('agent', 'name')
    .populate('application');
  if (!payment) throw new AppError('Payment not found', 404);
  res.json({ success: true, data: payment });
});

export const refundPayment = catchAsync(async (req, res) => {
  const { refundAmount, refundReason } = req.body;
  const payment = await Payment.findById(req.params.id);
  if (!payment) throw new AppError('Payment not found', 404);

  if (payment.status !== 'completed') {
    throw new AppError('Can only refund completed payments', 400);
  }

  if (refundAmount > payment.amount) {
    throw new AppError('Refund amount cannot exceed payment amount', 400);
  }

  payment.status = 'refunded';
  payment.refundAmount = refundAmount;
  payment.refundReason = refundReason;
  payment.refundedAt = new Date();

  await payment.save();
  res.json({ success: true, data: payment });
});

// Support Management
export const getSupportTickets = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;

  const tickets = await SupportTicket.find(filter)
    .populate('user', 'name email')
    .populate('assignedTo', 'name email')
    .sort('-createdAt');
  res.json({ success: true, data: tickets });
});

export const getSupportTicket = catchAsync(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('assignedTo', 'name email')
    .populate('messages.sender', 'name email role');
  if (!ticket) throw new AppError('Ticket not found', 404);
  res.json({ success: true, data: ticket });
});

export const updateTicketStatus = catchAsync(async (req, res) => {
  const { status, assignedTo } = req.body;
  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) throw new AppError('Ticket not found', 404);

  ticket.status = status;
  if (assignedTo) {
    ticket.assignedTo = assignedTo;
    ticket.assignedAt = new Date();
  }

  if (status === 'resolved') {
    ticket.resolvedAt = new Date();
    ticket.resolvedBy = req.user._id;
  }

  await ticket.save();
  res.json({ success: true, data: ticket });
});

// Settings
export const getSettings = catchAsync(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  res.json({ success: true, data: settings });
});

export const updateSettings = catchAsync(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }

  Object.assign(settings, req.body, { updatedBy: req.user._id });
  await settings.save();

  res.json({ success: true, data: settings });
});