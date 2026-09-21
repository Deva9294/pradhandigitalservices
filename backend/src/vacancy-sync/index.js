import crypto from 'node:crypto';

const APPROVED_DOMAINS = [
  'esb.mp.gov.in',
  'mppsc.mp.gov.in',
  'mponline.gov.in',
  'mp.gov.in',
];

export function normalizeDomain(value) {
  if (!value) return '';
  return String(value).replace(/^https?:\/\//i, '').replace(/\/.*$/, '').split('?')[0].toLowerCase();
}

export function isApprovedDomain(domain) {
  const normalized = normalizeDomain(domain);
  if (!normalized) return false;

  if (APPROVED_DOMAINS.includes(normalized)) return true;
  return normalized.endsWith('.gov.in') || normalized.endsWith('.mp.gov.in');
}

export function buildSourceKey(record = {}) {
  const sourceDomain = normalizeDomain(record.sourceDomain || record.sourcePageUrl || '');
  const advertisementNumber = normalizeText(record.advertisementNumber || record.externalExamId || '');
  const examId = normalizeText(record.externalExamId || '');
  const notificationUrl = normalizeUrl(record.notificationUrl || record.sourcePageUrl || '');

  if (sourceDomain && advertisementNumber) return `${sourceDomain}|${advertisementNumber}`;
  if (sourceDomain && examId) return `${sourceDomain}|${examId}`;
  if (notificationUrl) return notificationUrl;

  const title = normalizeText(record.title || '');
  const department = normalizeText(record.department || record.organization || '');
  const publishedDate = normalizeText(record.startDate || record.publishedAt || '');
  if (sourceDomain && title && department && publishedDate) {
    return `${sourceDomain}|${department}|${title}|${publishedDate}`;
  }

  return `${sourceDomain || 'unknown'}|${crypto.createHash('sha256').update(JSON.stringify(record)).digest('hex')}`;
}

export function normalizeText(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim();
}

export function normalizeUrl(value) {
  if (!value) return '';
  const url = String(value).trim();
  if (!/^https?:\/\//i.test(url)) return '';
  return url.replace(/\s+/g, '').replace(/#.*$/, '').toLowerCase();
}

export function parseDateText(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

  const strings = [
    value,
    String(value).trim(),
  ];

  const iso = new Date(strings[1]);
  if (!Number.isNaN(iso.getTime())) return iso;

  const cleaned = strings[1].replace(/\s+/g, ' ').trim();
  const formats = [
    /^([0-9]{1,2})[-/.]([0-9]{1,2})[-/.]([0-9]{4})$/,
    /^([0-9]{1,2})\s+([A-Za-zÀ-ÿ]+)\s+([0-9]{4})$/,
    /^([0-9]{1,2})\s+([A-Za-zÀ-ÿ]+),?\s+([0-9]{4})$/,
  ];

  for (const pattern of formats) {
    const match = cleaned.match(pattern);
    if (!match) continue;

    if (match.length === 4 && pattern.toString().includes('A-Za-z')) {
      const day = Number(match[1]);
      const month = monthNameToNumber(match[2]);
      const year = Number(match[3]);
      if (day && month && year) {
        const isoDate = new Date(Date.UTC(year, month - 1, day));
        if (!Number.isNaN(isoDate.getTime())) return isoDate;
      }
    } else {
      const day = Number(match[1]);
      const month = Number(match[2]);
      const year = Number(match[3]);
      if (day && month && year) {
        const isoDate = new Date(Date.UTC(year, month - 1, day));
        if (!Number.isNaN(isoDate.getTime())) return isoDate;
      }
    }
  }

  return null;
}

export function monthNameToNumber(value) {
  const months = {
    jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5, jun: 6, june: 6,
    jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10, october: 10,
    nov: 11, november: 11, dec: 12, december: 12,
    janv: 1, fevr: 2, mars: 3, avril: 4, juin: 6, juillet: 7, aout: 8, août: 8,
  };
  const key = String(value).toLowerCase().replace(/\./g, '');
  return months[key] || null;
}

export function validateVacancy(record = {}) {
  const errors = [];
  const title = normalizeText(record.title || '');
  const department = normalizeText(record.department || record.organization || '');
  const sourceDomain = normalizeDomain(record.sourceDomain || record.sourcePageUrl || '');
  const notificationUrl = normalizeUrl(record.notificationUrl || record.sourcePageUrl || '');
  const applyUrl = normalizeUrl(record.applyUrl || '');
  const lastDate = parseDateText(record.lastDate || '');
  const startDate = parseDateText(record.startDate || '');

  if (!title) errors.push('Title is required.');
  if (!department) errors.push('Department or organization is required.');
  if (!notificationUrl) errors.push('Official notification or official source page is required.');
  if (sourceDomain && !isApprovedDomain(sourceDomain)) {
    errors.push(`Source domain is not on the approved official domain allowlist: ${sourceDomain}`);
  }
  if (notificationUrl && !notificationUrl.startsWith('https://')) {
    errors.push('Official URLs must use HTTPS where supported.');
  }
  if (applyUrl && !applyUrl.startsWith('https://')) {
    errors.push('Apply URL must use HTTPS where supported.');
  }
  if (startDate && lastDate && lastDate < startDate) {
    errors.push('Last date must not be before start date.');
  }

  const type = normalizeText(record.vacancyType || record.type || '');
  if (type && /result|merit list|appointment order/i.test(type)) {
    errors.push('This record appears to be a result or old appointment order and is not a new vacancy.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function calculateStatus(record = {}) {
  const now = new Date();
  const start = parseDateText(record.startDate || '');
  const last = parseDateText(record.lastDate || '');
  const previousStatus = record.status || 'pending';
  const isExtended = Array.isArray(record.revisionHistory) && record.revisionHistory.some((item) => /lastDate|last_date_extended/i.test(item.field || item.type || ''));

  if (record.status === 'cancelled') return { status: 'cancelled', isUpdated: false };
  if (start && now < start) return { status: 'upcoming', isUpdated: isExtended };
  if (last && now <= new Date(last.getTime() + 86400000 * 1)) {
    return { status: 'active', isUpdated: isExtended || previousStatus === 'closed' };
  }
  if (last && now > last) return { status: 'closed', isUpdated: isExtended || previousStatus === 'active' };
  return { status: previousStatus || 'pending', isUpdated: isExtended };
}

export function shouldArchive(record = {}) {
  if (!record.lastDate) return false;
  const last = parseDateText(record.lastDate);
  if (!last) return false;
  return new Date() > new Date(last.getTime() + 86400000 * 1);
}

export function mergeVacancyUpdate(existing = {}, incoming = {}) {
  const next = { ...existing, ...incoming };
  const nextContentHash = crypto.createHash('sha256').update(JSON.stringify(next)).digest('hex');
  const importantFields = [
    'lastDate',
    'totalPosts',
    'qualification',
    'ageMinimum',
    'ageMaximum',
    'applicationFee',
    'notificationUrl',
    'applyUrl',
    'examDate',
    'status',
  ];

  const changes = [];
  for (const field of importantFields) {
    if (existing[field] !== incoming[field]) {
      changes.push({ field, previous: existing[field], next: incoming[field] });
    }
  }

  const revisionHistory = [...(Array.isArray(existing.revisionHistory) ? existing.revisionHistory : []), ...changes];
  const relatedUpdates = new Set(Array.isArray(existing.relatedUpdates) ? existing.relatedUpdates : []);

  if (changes.some((change) => change.field === 'lastDate')) {
    relatedUpdates.add('last_date_extended');
  }
  if (changes.some((change) => change.field === 'status' && /cancelled/i.test(String(change.next)))) {
    relatedUpdates.add('cancellation');
  }

  return {
    ...next,
    contentHash: nextContentHash,
    isUpdated: changes.length > 0,
    revisionHistory,
    relatedUpdates: Array.from(relatedUpdates),
  };
}

export function normalizeVacancy(record = {}) {
  const title = normalizeText(record.title || '');
  const department = normalizeText(record.department || record.organization || '');
  const sourceDomain = normalizeDomain(record.sourceDomain || record.sourcePageUrl || '');
  const notificationUrl = normalizeUrl(record.notificationUrl || record.sourcePageUrl || '');
  const applyUrl = normalizeUrl(record.applyUrl || '');
  const lastDate = parseDateText(record.lastDate || '');
  const startDate = parseDateText(record.startDate || '');
  const sourceKey = buildSourceKey(record);
  const base = {
    ...record,
    title,
    titleHindi: record.titleHindi || '',
    slug: record.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'vacancy',
    department,
    organization: normalizeText(record.organization || department),
    sourceName: normalizeText(record.sourceName || 'MP Official Source'),
    sourceDomain,
    notificationUrl,
    applyUrl,
    sourcePageUrl: normalizeUrl(record.sourcePageUrl || notificationUrl),
    sourceKey,
    status: 'pending',
    verificationStatus: 'pending_review',
    confidenceScore: record.confidenceScore || 0.5,
    isFeatured: Boolean(record.isFeatured),
    isNew: Boolean(record.isNew),
    isUpdated: Boolean(record.isUpdated),
    relatedUpdates: Array.isArray(record.relatedUpdates) ? record.relatedUpdates : [],
    revisionHistory: Array.isArray(record.revisionHistory) ? record.revisionHistory : [],
    startDate: startDate ? startDate.toISOString() : null,
    lastDate: lastDate ? lastDate.toISOString() : null,
    contentHash: '',
    state: normalizeText(record.state || 'Madhya Pradesh'),
    district: normalizeText(record.district || ''),
    category: normalizeText(record.category || 'Government'),
    totalPosts: Number(record.totalPosts || 0),
    qualification: normalizeText(record.qualification || ''),
  };

  const validation = validateVacancy(base);
  const statusResult = calculateStatus(base);

  base.status = statusResult.status;
  base.contentHash = crypto.createHash('sha256').update(JSON.stringify(base)).digest('hex');

  if (validation.valid && base.confidenceScore >= 0.7 && process.env.AUTO_PUBLISH_VERIFIED === 'true') {
    base.verificationStatus = 'auto_verified';
  } else if (validation.valid && base.confidenceScore >= 0.5) {
    base.verificationStatus = 'pending_review';
  } else {
    base.verificationStatus = 'rejected';
  }

  return base;
}

export function isCronAuthorized(authHeader, secret) {
  if (!secret) return false;
  if (!authHeader) return false;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader);
  if (!match) return false;
  return match[1] === secret;
}
