import AdmitCard from '../models/AdmitCard.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const getAllAdmitCards = catchAsync(async (req, res) => {
  const filter = { isActive: true };
  
  if (req.query.status) filter.status = req.query.status;
  if (req.query.year) filter.year = parseInt(req.query.year);
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { nameHi: { $regex: req.query.search, $options: 'i' } },
      { examName: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const admitCards = await AdmitCard.find(filter)
    .sort({ isFeatured: -1, releaseDate: -1 });

  res.json({ success: true, data: admitCards });
});

export const getAdmitCard = catchAsync(async (req, res) => {
  const admitCard = await AdmitCard.findOne({ slug: req.params.slug, isActive: true });
  
  if (!admitCard) throw new AppError('Admit card not found', 404);

  // Increment view count
  admitCard.views += 1;
  await admitCard.save();

  res.json({ success: true, data: admitCard });
});

export const createAdmitCard = catchAsync(async (req, res) => {
  const admitCard = await AdmitCard.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({ success: true, data: admitCard });
});

export const updateAdmitCard = catchAsync(async (req, res) => {
  const admitCard = await AdmitCard.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true }
  );

  if (!admitCard) throw new AppError('Admit card not found', 404);

  res.json({ success: true, data: admitCard });
});

export const deleteAdmitCard = catchAsync(async (req, res) => {
  const admitCard = await AdmitCard.findByIdAndUpdate(
    req.params.id,
    { isActive: false, updatedBy: req.user._id },
    { new: true }
  );

  if (!admitCard) throw new AppError('Admit card not found', 404);

  res.json({ success: true, message: 'Admit card deleted successfully' });
});