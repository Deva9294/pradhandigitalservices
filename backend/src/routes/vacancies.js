import express from 'express';
import mongoose from 'mongoose';
import Vacancy from '../models/Vacancy.js';
import ServiceApplication from '../models/ServiceApplication.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import { isCronAuthorized } from '../vacancy-sync/index.js';

const router = express.Router();

/**
 * Helper to compute IST dynamic status
 */
function getISTDynamicStatus(vacancy) {
  const now = new Date();
  if (vacancy.status === 'cancelled') return 'cancelled';
  if (vacancy.status === 'archived') return 'archived';

  const startDate = vacancy.startDate ? new Date(vacancy.startDate) : null;
  const lastDate = vacancy.lastDate ? new Date(vacancy.lastDate) : null;

  if (startDate && now < startDate) {
    return 'upcoming';
  }

  if (lastDate) {
    // If lastDate has passed
    if (now > lastDate) {
      return 'closed';
    }
    const msLeft = lastDate.getTime() - now.getTime();
    const daysLeft = msLeft / (1000 * 60 * 60 * 24);
    if (daysLeft <= 7) {
      return 'closing_soon';
    }
    return 'active';
  }

  return vacancy.status || 'active';
}

/**
 * GET /api/vacancies/summary/counts
 * Returns counts for all tabs for badge displays
 */
router.get('/summary/counts', asyncHandler(async (req, res) => {
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    allCount,
    activeCount,
    closingSoonCount,
    upcomingCount,
    admitCardCount,
    resultCount,
    answerKeyCount,
    examNoticeCount,
    offlineFormCount,
    archiveCount
  ] = await Promise.all([
    Vacancy.countDocuments({ isActive: true }),
    // Active: now between startDate and lastDate, and lastDate > 7 days away
    Vacancy.countDocuments({
      isActive: true,
      status: { $ne: 'cancelled' },
      $or: [
        { startDate: { $lte: now }, lastDate: { $gt: sevenDaysLater } },
        { startDate: { $exists: false }, lastDate: { $gt: sevenDaysLater } },
        { status: 'active', lastDate: { $gt: sevenDaysLater } }
      ]
    }),
    // Closing soon: now <= lastDate and lastDate <= 7 days away
    Vacancy.countDocuments({
      isActive: true,
      status: { $ne: 'cancelled' },
      lastDate: { $gte: now, $lte: sevenDaysLater }
    }),
    // Upcoming: startDate > now or status = 'upcoming'
    Vacancy.countDocuments({
      isActive: true,
      status: { $ne: 'cancelled' },
      $or: [
        { startDate: { $gt: now } },
        { status: 'upcoming' }
      ]
    }),
    // Admit cards
    Vacancy.countDocuments({
      isActive: true,
      $or: [
        { admitCardUrl: { $exists: true, $ne: '' } },
        { admitCardDate: { $exists: true, $ne: null } }
      ]
    }),
    // Results
    Vacancy.countDocuments({
      isActive: true,
      $or: [
        { resultUrl: { $exists: true, $ne: '' } },
        { scorecardUrl: { $exists: true, $ne: '' } },
        { meritListUrl: { $exists: true, $ne: '' } }
      ]
    }),
    // Answer keys
    Vacancy.countDocuments({
      isActive: true,
      answerKeyUrl: { $exists: true, $ne: '' }
    }),
    // Exam notices
    Vacancy.countDocuments({
      isActive: true,
      $or: [
        { examDate: { $exists: true, $ne: null } },
        { examDateNote: { $exists: true, $ne: '' } },
        { syllabusUrl: { $exists: true, $ne: '' } }
      ]
    }),
    // Offline forms
    Vacancy.countDocuments({
      isActive: true,
      $or: [
        { applicationMode: { $in: ['offline', 'both'] } },
        { 'offlineFormDetails.formPdfUrl': { $exists: true, $ne: '' } }
      ]
    }),
    // Archive: closed or lastDate in past
    Vacancy.countDocuments({
      isActive: true,
      $or: [
        { status: 'archived' },
        { status: 'closed' },
        { lastDate: { $lt: now } }
      ]
    })
  ]);

  res.json({
    success: true,
    counts: {
      all: allCount,
      active: activeCount,
      closing_soon: closingSoonCount,
      upcoming: upcomingCount,
      admit_cards: admitCardCount,
      results: resultCount,
      answer_keys: answerKeyCount,
      exam_notices: examNoticeCount,
      offline_forms: offlineFormCount,
      archive: archiveCount
    }
  });
}));

/**
 * GET /api/vacancies
 * Filtered listing with tabs, authorities, scope, search and pagination
 */
router.get('/', asyncHandler(async (req, res) => {
  const {
    tab,
    scope,
    category,
    type,
    search,
    featured,
    status,
    state,
    qualification,
    qualificationLevel,
    department,
    authority,
    mode,
    feeExempt,
    page = 1,
    limit = 50
  } = req.query;

  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const query = { isActive: true };

  // Tab Filtering
  if (tab === 'closing_soon') {
    query.status = { $ne: 'cancelled' };
    query.lastDate = { $gte: now, $lte: sevenDaysLater };
  } else if (tab === 'upcoming') {
    query.status = { $ne: 'cancelled' };
    query.$or = [
      { startDate: { $gt: now } },
      { status: 'upcoming' }
    ];
  } else if (tab === 'admit_cards') {
    query.$or = [
      { admitCardUrl: { $exists: true, $ne: '' } },
      { admitCardDate: { $exists: true, $ne: null } }
    ];
  } else if (tab === 'results') {
    query.$or = [
      { resultUrl: { $exists: true, $ne: '' } },
      { scorecardUrl: { $exists: true, $ne: '' } },
      { meritListUrl: { $exists: true, $ne: '' } }
    ];
  } else if (tab === 'answer_keys') {
    query.answerKeyUrl = { $exists: true, $ne: '' };
  } else if (tab === 'exam_notices') {
    query.$or = [
      { examDate: { $exists: true, $ne: null } },
      { examDateNote: { $exists: true, $ne: '' } },
      { syllabusUrl: { $exists: true, $ne: '' } }
    ];
  } else if (tab === 'offline_forms') {
    query.$or = [
      { applicationMode: { $in: ['offline', 'both'] } },
      { 'offlineFormDetails.formPdfUrl': { $exists: true, $ne: '' } }
    ];
  } else if (tab === 'archive') {
    query.$or = [
      { status: 'archived' },
      { status: 'closed' },
      { lastDate: { $lt: now } }
    ];
  } else if (tab === 'active' || !tab) {
    // Default Active view: open vacancies whose lastDate is strictly in future
    // and not upcoming
    if (!status) {
      query.status = { $nin: ['archived', 'closed', 'cancelled'] };
      query.$or = [
        { lastDate: { $gte: now } },
        { lastDate: { $exists: false } },
        { lastDate: null }
      ];
      // Do not show upcoming in currently open
      query.startDate = { $lte: now };
    }
  }

  // Explicit status override if provided
  if (status) query.status = status;

  // Scope filter (MP vs All India vs State)
  if (scope) {
    if (scope.toLowerCase() === 'mp') {
      query.$or = [
        { locationScope: 'MP' },
        { state: /madhya pradesh/i }
      ];
    } else if (scope.toLowerCase() === 'all india') {
      query.$or = [
        { locationScope: 'All India' },
        { vacancyType: 'central' }
      ];
    } else {
      query.locationScope = scope;
    }
  }

  // Department & Authority
  if (department && department !== 'All Departments') {
    query.$or = [
      { department: { $regex: department, $options: 'i' } },
      { departmentHi: { $regex: department, $options: 'i' } },
      { recruitingAuthority: { $regex: department, $options: 'i' } }
    ];
  }

  if (authority) {
    query.recruitingAuthority = { $regex: authority, $options: 'i' };
  }

  // Qualification
  if (qualificationLevel && qualificationLevel !== 'All') {
    query.qualificationLevel = qualificationLevel;
  } else if (qualification && qualification !== 'All') {
    query.$or = [
      { qualification: { $regex: qualification, $options: 'i' } },
      { qualificationTags: { $in: [qualification] } },
      { qualificationLevel: qualification }
    ];
  }

  // Mode
  if (mode && mode !== 'all') {
    query.applicationMode = mode;
  }

  // Fee exempt
  if (feeExempt === 'true') {
    query.isFeeExempt = true;
  }

  // Category
  if (category && category !== 'All Types' && category !== 'all') {
    query.category = category.toLowerCase();
  }

  if (type) query.vacancyType = type;
  if (state && state !== 'All India') query.state = state;
  if (featured === 'true') query.isFeatured = true;

  // Search
  if (search) {
    const sRegex = { $regex: search.trim(), $options: 'i' };
    query.$or = [
      { title: sRegex },
      { titleHi: sRegex },
      { organization: sRegex },
      { organizationHi: sRegex },
      { department: sRegex },
      { departmentHi: sRegex },
      { recruitingAuthority: sRegex },
      { advertisementNumber: sRegex }
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  // Sorting: Closing soon sorts by lastDate asc; Active sorts by publishedAt desc; Archive sorts by lastDate desc
  let sortObj = { publishedAt: -1, createdAt: -1 };
  if (tab === 'closing_soon') {
    sortObj = { lastDate: 1 };
  } else if (tab === 'archive') {
    sortObj = { lastDate: -1, closedAt: -1 };
  } else if (tab === 'upcoming') {
    sortObj = { startDate: 1 };
  }

  const [vacancies, total] = await Promise.all([
    Vacancy.find(query).sort(sortObj).skip(skip).limit(limitNum).lean(),
    Vacancy.countDocuments(query)
  ]);

  // Inject calculated dynamic status for fresh client display
  const enrichedVacancies = vacancies.map((v) => ({
    ...v,
    dynamicStatus: getISTDynamicStatus(v)
  }));

  res.json({
    success: true,
    count: enrichedVacancies.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    vacancies: enrichedVacancies
  });
}));

/**
 * GET /api/vacancies/archive
 * Legacy compatibility endpoint
 */
router.get('/archive', asyncHandler(async (req, res) => {
  const now = new Date();
  const vacancies = await Vacancy.find({
    isActive: true,
    $or: [{ status: 'archived' }, { status: 'closed' }, { lastDate: { $lt: now } }]
  }).sort({ lastDate: -1, closedAt: -1 }).limit(100).lean();

  res.json({
    success: true,
    count: vacancies.length,
    vacancies: vacancies.map(v => ({ ...v, dynamicStatus: 'closed' }))
  });
}));

/**
 * GET /api/vacancies/:identifier
 * Supports fetching by slug or mongo ObjectId
 */
router.get('/:identifier', asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const isId = mongoose.isValidObjectId(identifier);

  const query = isId
    ? { _id: identifier, isActive: true }
    : { slug: identifier.toLowerCase().trim(), isActive: true };

  const vacancy = await Vacancy.findOne(query);

  if (!vacancy) {
    return res.status(404).json({ success: false, message: 'Vacancy not found' });
  }

  // Increment view counter asynchronously
  Vacancy.findByIdAndUpdate(vacancy._id, { $inc: { views: 1 } }).exec();

  const dynamicStatus = getISTDynamicStatus(vacancy);
  const data = vacancy.toObject();
  data.dynamicStatus = dynamicStatus;

  res.json({ success: true, vacancy: data });
}));

/**
 * POST /api/vacancies/:id/apply-assistance
 * Allows users to request PDS assistance for filing this vacancy application.
 * Validates that the lastDate has not passed.
 */
router.post('/:id/apply-assistance', protect, asyncHandler(async (req, res) => {
  const vacancy = await Vacancy.findById(req.params.id);
  if (!vacancy || !vacancy.isActive) {
    return res.status(404).json({ success: false, message: 'Vacancy not found or inactive.' });
  }

  const now = new Date();
  if (vacancy.lastDate && now > new Date(vacancy.lastDate)) {
    return res.status(400).json({
      success: false,
      message: 'इस भर्ती की आवेदन अंतिम तिथि समाप्त हो चुकी है। PDS सहायता फॉर्म स्वीकार नहीं किए जा रहे हैं।'
    });
  }

  const { applicantDetails, uploadedDocuments, preferredCategory, notes } = req.body;

  const appNumber = `PDS-VAC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const application = await ServiceApplication.create({
    applicationNumber: appNumber,
    user: req.user._id,
    serviceTitle: `Job Assistance: ${vacancy.title}`,
    serviceCategory: 'Government Jobs',
    status: 'submitted',
    applicantDetails: {
      fullName: applicantDetails?.fullName || req.user.name,
      phone: applicantDetails?.phone || req.user.phone,
      email: applicantDetails?.email || req.user.email,
      category: preferredCategory || applicantDetails?.category || 'UR',
      dob: applicantDetails?.dob,
      qualification: applicantDetails?.qualification || vacancy.qualification
    },
    serviceDetails: {
      vacancyId: vacancy._id,
      recruitmentTitle: vacancy.title,
      department: vacancy.department,
      advertisementNumber: vacancy.advertisementNumber,
      lastDate: vacancy.lastDate,
      officialFee: vacancy.feeDetails?.general || 0,
      pdsServiceCharge: vacancy.pdsAssistance?.fee || 50,
      notes
    },
    documents: (uploadedDocuments || []).map(doc => ({
      documentType: doc.documentType || 'Identity Proof',
      fileUrl: doc.fileUrl,
      fileName: doc.fileName,
      status: 'uploaded',
      uploadedAt: new Date()
    })),
    timeline: [{
      status: 'submitted',
      note: 'PDS Job Application assistance request submitted successfully.',
      updatedBy: req.user.name,
      updatedAt: new Date()
    }]
  });

  res.status(201).json({
    success: true,
    message: 'आवेदन सहायता अनुरोध सफलतापूर्वक प्राप्त हुआ। हमारी टीम जल्द ही आपसे संपर्क करेगी।',
    applicationNumber: appNumber,
    application
  });
}));

/**
 * Admin: POST /api/vacancies
 */
router.post('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const vacancy = await Vacancy.create(req.body);
  res.status(201).json({ success: true, message: 'Vacancy created successfully', vacancy });
}));

/**
 * Admin: PUT /api/vacancies/:id
 * Tracks revision history if dates, seats, or fees change
 */
router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const existing = await Vacancy.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Vacancy not found' });
  }

  const updates = { ...req.body };
  const revisions = [...(existing.revisionHistory || [])];

  // Track key modifications
  if (updates.lastDate && new Date(updates.lastDate).getTime() !== new Date(existing.lastDate).getTime()) {
    revisions.push({
      field: 'lastDate',
      previous: existing.lastDate,
      next: updates.lastDate,
      reason: updates.revisionReason || 'Application deadline extended',
      changedAt: new Date()
    });
    updates.isExtended = true;
    updates.isUpdated = true;
  }

  if (updates.totalPosts && updates.totalPosts !== existing.totalPosts) {
    revisions.push({
      field: 'totalPosts',
      previous: existing.totalPosts,
      next: updates.totalPosts,
      reason: updates.revisionReason || 'Post count revised',
      changedAt: new Date()
    });
    updates.isUpdated = true;
  }

  updates.revisionHistory = revisions;

  const vacancy = await Vacancy.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, message: 'Vacancy updated successfully', vacancy });
}));

/**
 * Admin: DELETE /api/vacancies/:id
 */
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const vacancy = await Vacancy.findByIdAndDelete(req.params.id);
  if (!vacancy) {
    return res.status(404).json({ success: false, message: 'Vacancy not found' });
  }
  res.json({ success: true, message: 'Vacancy deleted successfully' });
}));

/**
 * Public & Admin Sync Trigger
 * GET/POST /api/vacancies/sync
 */
router.all('/sync', asyncHandler(async (req, res) => {
  const syncModule = await import('../vacancy-sync/sync.js');
  const summary = await syncModule.syncAllVacancies();
  res.json({
    success: true,
    message: 'भर्तियां सफलतापूर्वक सिंक और अपडेट की गईं (Vacancies synced successfully)',
    summary
  });
}));

/**
 * Manual Sync Trigger
 */
router.post('/sync/manual', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const syncModule = await import('../vacancy-sync/sync.js');
  const summary = await syncModule.syncAllVacancies();
  res.json({ success: true, summary });
}));

/**
 * Cron Trigger
 */
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