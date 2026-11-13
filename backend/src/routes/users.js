import express from 'express';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const publicUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email || '',
  phone: user.phone,
  avatar: user.avatar || '',
  addresses: user.addresses || [],
  dateOfBirth: user.dateOfBirth || null,
  gender: user.gender || '',
  preferredLanguage: user.preferredLanguage || 'en',
  notificationsEnabled: user.notificationsEnabled !== false
});

// @route PUT /api/users/profile
// Phone and role are intentionally immutable here; phone changes require OTP verification.
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const name = typeof req.body.name === 'string' ? req.body.name.trim() : user.name;
  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ success: false, message: 'Name must be between 2 and 80 characters.' });
  }

  let email = user.email;
  if (Object.prototype.hasOwnProperty.call(req.body, 'email')) {
    email = String(req.body.email || '').trim().toLowerCase();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
    }
    if (email) {
      const duplicate = await User.findOne({ email, _id: { $ne: user._id } }).select('_id');
      if (duplicate) return res.status(409).json({ success: false, message: 'This email is already linked to another account.' });
    }
  }

  const updates = { name, email: email || undefined };
  if (typeof req.body.avatar === 'string') {
    const avatar = req.body.avatar.trim();
    if (avatar.length > 2048) return res.status(400).json({ success: false, message: 'Avatar URL is too long.' });
    updates.avatar = avatar;
  }
  if (req.body.dateOfBirth !== undefined) {
    const dob = req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : null;
    if (dob && (Number.isNaN(dob.getTime()) || dob > new Date())) {
      return res.status(400).json({ success: false, message: 'Enter a valid date of birth.' });
    }
    updates.dateOfBirth = dob;
  }
  if (req.body.gender !== undefined) {
    const gender = String(req.body.gender || '');
    if (gender && !['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ success: false, message: 'Select a valid gender option.' });
    }
    updates.gender = gender || undefined;
  }
  if (req.body.preferredLanguage !== undefined) {
    const language = String(req.body.preferredLanguage);
    if (!['en', 'hi'].includes(language)) return res.status(400).json({ success: false, message: 'Unsupported language.' });
    updates.preferredLanguage = language;
  }
  if (req.body.notificationsEnabled !== undefined) updates.notificationsEnabled = Boolean(req.body.notificationsEnabled);

  if (req.body.address && typeof req.body.address === 'object' && !Array.isArray(req.body.address)) {
    const address = req.body.address;
    const cleanAddress = {
      line1: String(address.line1 || '').trim().slice(0, 120),
      line2: String(address.line2 || '').trim().slice(0, 120),
      city: String(address.city || '').trim().slice(0, 80),
      state: String(address.state || '').trim().slice(0, 80),
      pincode: String(address.pincode || '').trim().slice(0, 10),
      landmark: String(address.landmark || '').trim().slice(0, 120),
      country: 'India',
      isDefault: true
    };
    if (cleanAddress.pincode && !/^\d{6}$/.test(cleanAddress.pincode)) {
      return res.status(400).json({ success: false, message: 'PIN code must contain 6 digits.' });
    }
    const existing = user.addresses.findIndex((item) => item.isDefault);
    if (existing >= 0) user.addresses[existing] = cleanAddress;
    else user.addresses.push(cleanAddress);
  }

  Object.assign(user, updates);
  await user.save();
  res.json({ success: true, message: 'Profile updated successfully.', user: publicUser(user) });
}));

router.put('/password', protect, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || newPassword.length < 8 || newPassword.length > 128) {
    return res.status(400).json({ success: false, message: 'New password must be 8–128 characters.' });
  }
  const user = await User.findById(req.user.id).select('+password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated successfully' });
}));

export default router;
