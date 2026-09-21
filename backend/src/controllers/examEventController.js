import ExamEvent from '../models/ExamEvent.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const getAllExamEvents = catchAsync(async (req, res) => {
  const filter = { isActive: true };
  
  if (req.query.year) filter.year = parseInt(req.query.year);
  if (req.query.examType) filter.examType = req.query.examType;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { nameHi: { $regex: req.query.search, $options: 'i' } },
      { conductingBody: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const examEvents = await ExamEvent.find(filter)
    .sort({ examDate: 1 });

  res.json({ success: true, data: examEvents });
});

export const getExamEvent = catchAsync(async (req, res) => {
  const examEvent = await ExamEvent.findOne({ slug: req.params.slug, isActive: true });
  
  if (!examEvent) throw new AppError('Exam event not found', 404);

  res.json({ success: true, data: examEvent });
});

export const createExamEvent = catchAsync(async (req, res) => {
  const examEvent = await ExamEvent.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({ success: true, data: examEvent });
});

export const updateExamEvent = catchAsync(async (req, res) => {
  const examEvent = await ExamEvent.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true }
  );

  if (!examEvent) throw new AppError('Exam event not found', 404);

  res.json({ success: true, data: examEvent });
});

export const deleteExamEvent = catchAsync(async (req, res) => {
  const examEvent = await ExamEvent.findByIdAndUpdate(
    req.params.id,
    { isActive: false, updatedBy: req.user._id },
    { new: true }
  );

  if (!examEvent) throw new AppError('Exam event not found', 404);

  res.json({ success: true, message: 'Exam event deleted successfully' });
});