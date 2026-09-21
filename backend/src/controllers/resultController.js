import Result from '../models/Result.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const getAllResults = catchAsync(async (req, res) => {
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

  const results = await Result.find(filter)
    .sort({ isFeatured: -1, declarationDate: -1 });

  res.json({ success: true, data: results });
});

export const getResult = catchAsync(async (req, res) => {
  const result = await Result.findOne({ slug: req.params.slug, isActive: true });
  
  if (!result) throw new AppError('Result not found', 404);

  // Increment view count
  result.views += 1;
  await result.save();

  res.json({ success: true, data: result });
});

export const createResult = catchAsync(async (req, res) => {
  const result = await Result.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({ success: true, data: result });
});

export const updateResult = catchAsync(async (req, res) => {
  const result = await Result.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true }
  );

  if (!result) throw new AppError('Result not found', 404);

  res.json({ success: true, data: result });
});

export const deleteResult = catchAsync(async (req, res) => {
  const result = await Result.findByIdAndUpdate(
    req.params.id,
    { isActive: false, updatedBy: req.user._id },
    { new: true }
  );

  if (!result) throw new AppError('Result not found', 404);

  res.json({ success: true, message: 'Result deleted successfully' });
});