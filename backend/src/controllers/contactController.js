import ContactInquiry from '../models/ContactInquiry.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const INDIAN_MOBILE = /^[6-9]\d{9}$/;

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '').replace(/^91/, '').slice(-10);
  return digits;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export const submitInquiry = catchAsync(async (req, res) => {
  const { name, email, phone, subject, message, source } = req.body;

  if (!name?.trim()) throw new AppError('Name is required', 400);
  if (!message?.trim() || message.trim().length < 10) {
    throw new AppError('Message must be at least 10 characters', 400);
  }

  const normalizedPhone = normalizePhone(phone);
  if (!INDIAN_MOBILE.test(normalizedPhone)) {
    throw new AppError('Enter a valid 10-digit Indian mobile number', 400);
  }

  if (email?.trim() && !isValidEmail(email)) {
    throw new AppError('Enter a valid email address', 400);
  }

  const inquiry = await ContactInquiry.create({
    name: name.trim(),
    email: email?.trim() || undefined,
    phone: normalizedPhone,
    subject: subject?.trim() || 'General inquiry',
    message: message.trim(),
    source: source?.trim() || 'website',
  });

  res.status(201).json({
    success: true,
    message: 'Thank you! We will contact you shortly.',
    data: { id: inquiry._id },
  });
});
