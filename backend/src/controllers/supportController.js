import SupportTicket from '../models/SupportTicket.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const createTicket = catchAsync(async (req, res) => {
  const { subject, description, category, priority } = req.body;

  const ticket = await SupportTicket.create({
    user: req.user._id,
    subject,
    description,
    category: category || 'general',
    priority: priority || 'normal',
    status: 'open',
    messages: [{
      sender: req.user._id,
      message: description,
      isInternal: false
    }],
    createdBy: req.user._id
  });

  res.status(201).json({ success: true, data: ticket });
});

export const getMyTickets = catchAsync(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const tickets = await SupportTicket.find(filter)
    .populate('assignedTo', 'name email')
    .sort('-createdAt');

  res.json({ success: true, data: tickets });
});

export const getTicket = catchAsync(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('assignedTo', 'name email')
    .populate('messages.sender', 'name email role');

  if (!ticket) throw new AppError('Ticket not found', 404);

  // Check authorization
  const isOwner = String(ticket.user._id) === String(req.user._id);
  const isAssigned = ticket.assignedTo && String(ticket.assignedTo) === String(req.user._id);
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

  if (!isOwner && !isAssigned && !isAdmin) {
    throw new AppError('Not authorized', 403);
  }

  res.json({ success: true, data: ticket });
});

export const addMessage = catchAsync(async (req, res) => {
  const { message, isInternal = false } = req.body;
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) throw new AppError('Ticket not found', 404);

  // Check authorization
  const isOwner = String(ticket.user) === String(req.user._id);
  const isAssigned = ticket.assignedTo && String(ticket.assignedTo) === String(req.user._id);
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

  if (!isOwner && !isAssigned && !isAdmin) {
    throw new AppError('Not authorized', 403);
  }

  // Only admin/agent can add internal messages
  if (isInternal && !isAdmin && !isAssigned) {
    throw new AppError('Not authorized to add internal messages', 403);
  }

  ticket.messages.push({
    sender: req.user._id,
    message,
    isInternal
  });

  // Update status if it was waiting for customer
  if (ticket.status === 'waiting_for_customer' && !isInternal) {
    ticket.status = 'in_progress';
  }

  await ticket.save();

  res.json({ success: true, data: ticket });
});

export const updateStatus = catchAsync(async (req, res) => {
  const { status, assignedTo } = req.body;
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) throw new AppError('Ticket not found', 404);

  // Only admin/agent can update status
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);
  const isAgent = ['agent'].includes(req.user.role);

  if (!isAdmin && !isAgent) {
    throw new AppError('Not authorized', 403);
  }

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

export const rateTicket = catchAsync(async (req, res) => {
  const { rating, feedback } = req.body;
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) throw new AppError('Ticket not found', 404);

  // Check authorization
  if (String(ticket.user) !== String(req.user._id)) {
    throw new AppError('Not authorized', 403);
  }

  if (ticket.status !== 'resolved') {
    throw new AppError('Can only rate resolved tickets', 400);
  }

  ticket.rating = rating;
  ticket.feedback = feedback;

  await ticket.save();

  res.json({ success: true, data: ticket });
});