import express from 'express';
import mongoose from 'mongoose';
import DownloadForm from '../models/DownloadForm.js';
import FormPurchase from '../models/FormPurchase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const publicForm = (form) => ({
  id: String(form._id),
  slug: form.slug,
  name: form.title,
  nameHi: form.titleHi || '',
  description: form.description || '',
  descriptionHi: form.descriptionHi || '',
  category: form.category,
  department: form.department,
  state: form.state,
  language: form.language,
  format: form.format,
  fileSize: form.fileSize,
  pageCount: form.pageCount,
  isFree: Boolean(form.isFree || Number(form.price) === 0),
  price: Number(form.price || 0),
  thumbnailUrl: form.thumbnailUrl || '',
  officialSource: form.officialSource || '',
  officialUrl: form.officialUrl || '',
  isFeatured: Boolean(form.isFeatured)
});

const findForm = async (id) => {
  const filter = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
  return DownloadForm.findOne({ ...filter, isActive: true, status: 'active' });
};

// @route GET /api/forms
// @desc List published forms from MongoDB (no mock records).
router.get('/', asyncHandler(async (req, res) => {
  const filter = { isActive: true, status: 'active' };
  if (req.query.category) filter.category = String(req.query.category);
  if (req.query.state) filter.state = String(req.query.state);
  if (req.query.search) {
    const term = String(req.query.search).trim().slice(0, 80);
    if (term) filter.$or = [
      { title: { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
      { titleHi: { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
      { department: { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
    ];
  }
  const forms = await DownloadForm.find(filter)
    .select('title titleHi slug description descriptionHi category department state language format fileSize pageCount isFree price thumbnailUrl officialSource officialUrl isFeatured')
    .sort({ isFeatured: -1, title: 1 })
    .limit(200)
    .lean();
  res.json({ success: true, count: forms.length, forms: forms.map(publicForm) });
}));

// @route POST /api/forms/:id/purchase
// Free downloads are persisted. Paid downloads are deliberately blocked until a
// verified payment-to-download fulfilment flow is connected.
router.post('/:id/purchase', protect, asyncHandler(async (req, res) => {
  const form = await findForm(req.params.id);
  if (!form) return res.status(404).json({ success: false, message: 'Form not found or no longer available.' });

  const amount = Number(form.price || 0);
  const isFree = Boolean(form.isFree || amount === 0);
  if (!isFree) {
    return res.status(409).json({
      success: false,
      code: 'PAYMENT_FULFILMENT_NOT_CONFIGURED',
      message: 'Paid form downloads are temporarily unavailable. Payment verification and download fulfilment are not connected yet. No money has been collected.'
    });
  }

  const purchase = await FormPurchase.findOneAndUpdate(
    { user: req.user._id, form: form._id },
    { $setOnInsert: { user: req.user._id, form: form._id, amount: 0, currency: 'INR', status: 'completed' } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.status(200).json({
    success: true,
    message: 'Free form added to your downloads.',
    purchase: { id: String(purchase._id), formId: String(form._id), status: purchase.status, purchasedAt: purchase.purchasedAt }
  });
}));

// @route GET /api/forms/history
router.get('/history', protect, asyncHandler(async (req, res) => {
  const purchases = await FormPurchase.find({ user: req.user._id, status: 'completed' })
    .populate({ path: 'form', select: 'title titleHi slug category format thumbnailUrl' })
    .sort({ purchasedAt: -1 })
    .limit(100)
    .lean();
  res.json({
    success: true,
    count: purchases.length,
    purchases: purchases.filter((item) => item.form).map((item) => ({
      id: String(item._id),
      status: item.status,
      amount: item.amount,
      purchasedAt: item.purchasedAt,
      form: {
        id: String(item.form._id),
        name: item.form.title,
        nameHi: item.form.titleHi || '',
        slug: item.form.slug,
        category: item.form.category,
        format: item.form.format,
        thumbnailUrl: item.form.thumbnailUrl || ''
      }
    }))
  });
}));

// @route GET /api/forms/download/:purchaseId
router.get('/download/:purchaseId', protect, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.purchaseId)) {
    return res.status(404).json({ success: false, message: 'Download record not found.' });
  }
  const purchase = await FormPurchase.findOne({
    _id: req.params.purchaseId,
    user: req.user._id,
    status: 'completed'
  }).populate('form');
  if (!purchase || !purchase.form || !purchase.form.isActive || purchase.form.status !== 'active') {
    return res.status(404).json({ success: false, message: 'Download is not available for this account.' });
  }
  let fileUrl;
  try {
    fileUrl = new URL(purchase.form.fileUrl);
  } catch {
    return res.status(503).json({ success: false, message: 'The form file is not configured correctly. Please contact support.' });
  }
  if (!['https:', 'http:'].includes(fileUrl.protocol)) {
    return res.status(503).json({ success: false, message: 'The configured form file URL is invalid.' });
  }
  purchase.downloadedAt = new Date();
  await purchase.save();
  await DownloadForm.updateOne({ _id: purchase.form._id }, { $inc: { downloadCount: 1 } });
  res.json({ success: true, downloadUrl: fileUrl.toString(), expiresAt: null });
}));

// @route GET /api/forms/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const form = await findForm(req.params.id);
  if (!form) return res.status(404).json({ success: false, message: 'Form not found.' });
  await DownloadForm.updateOne({ _id: form._id }, { $inc: { viewCount: 1 } });
  res.json({ success: true, form: publicForm(form) });
}));

export default router;
