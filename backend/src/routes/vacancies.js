import express from 'express';
import Vacancy from '../models/Vacancy.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import { isCronAuthorized } from '../vacancy-sync/index.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const { category, type, search, featured, status, state, qualification, department } = req.query;

  const query = { isActive: true, status: { $ne: 'archived' } };

  if (status) query.status = status;
  if (category) query.category = category;
  if (type) query.vacancyType = type;
  if (state) query.state = state;
  if (qualification) query.qualification = { $regex: qualification, $options: 'i' };
  if (department) query.department = { $regex: department, $options: 'i' };
  if (featured === 'true') query.isFeatured = true;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { titleHi: { $regex: search, $options: 'i' } },
      { organization: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
      { advertisementNumber: { $regex: search, $options: 'i' } }
    ];
  }

  const vacancies = await Vacancy.find(query).sort({ lastDate: 1, publishedAt: -1 });

  res.json({ success: true, count: vacancies.length, vacancies });
}));

router.get('/archive', asyncHandler(async (req, res) => {
  const vacancies = await Vacancy.find({ status: 'archived' }).sort({ closedAt: -1 });
  res.json({ success: true, count: vacancies.length, vacancies });
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const vacancy = await Vacancy.findOne({ slug: req.params.slug, isActive: true, status: { $ne: 'archived' } });

  if (!vacancy) {
    return res.status(404).json({ success: false, message: 'Vacancy not found' });
  }

  vacancy.views = Number(vacancy.views || 0) + 1;
  await vacancy.save();

  res.json({ success: true, vacancy });
}));

router.post('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const vacancy = await Vacancy.create(req.body);

  res.status(201).json({ success: true, message: 'Vacancy created successfully', vacancy });
}));

router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const vacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!vacancy) {
    return res.status(404).json({ success: false, message: 'Vacancy not found' });
  }

  res.json({ success: true, message: 'Vacancy updated successfully', vacancy });
}));

router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const vacancy = await Vacancy.findByIdAndDelete(req.params.id);

  if (!vacancy) {
    return res.status(404).json({ success: false, message: 'Vacancy not found' });
  }

  res.json({ success: true, message: 'Vacancy deleted successfully' });
}));

router.post('/sync/manual', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const syncModule = await import('../vacancy-sync/sync.js');
  const summary = await syncModule.syncAllVacancies();
  res.json({ success: true, summary });
}));

router.post('/cron', asyncHandler(async (req, res) => {
  const secret = process.env.VACANCY_CRON_SECRET || '';
  if (!isCronAuthorized(req.headers.authorization, secret)) {
    return res.status(401).json({ success: false, message: 'Invalid or missing cron secret' });
  }

  const syncModule = await import('../vacancy-sync/sync.js');
  const summary = await syncModule.syncAllVacancies();

  res.json({ success: true, summary });
}));

export default router;
