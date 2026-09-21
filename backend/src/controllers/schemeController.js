import Scheme from '../models/Scheme.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const getAllSchemes = catchAsync(async (req, res) => {
  const filter = { isActive: true };
  
  if (req.query.category) filter.category = req.query.category;
  if (req.query.state) filter.state = req.query.state;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { nameHi: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const schemes = await Scheme.find(filter)
    .sort({ isFeatured: -1, createdAt: -1 });

  res.json({ success: true, data: schemes });
});

export const getScheme = catchAsync(async (req, res) => {
  const scheme = await Scheme.findOne({ slug: req.params.slug, isActive: true });
  
  if (!scheme) throw new AppError('Scheme not found', 404);

  // Increment view count
  scheme.views += 1;
  await scheme.save();

  res.json({ success: true, data: scheme });
});

export const createScheme = catchAsync(async (req, res) => {
  const scheme = await Scheme.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({ success: true, data: scheme });
});

export const updateScheme = catchAsync(async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true }
  );

  if (!scheme) throw new AppError('Scheme not found', 404);

  res.json({ success: true, data: scheme });
});

export const deleteScheme = catchAsync(async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(
    req.params.id,
    { isActive: false, updatedBy: req.user._id },
    { new: true }
  );

  if (!scheme) throw new AppError('Scheme not found', 404);

  res.json({ success: true, message: 'Scheme deleted successfully' });
});