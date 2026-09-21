import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeVacancy,
  buildSourceKey,
  validateVacancy,
  calculateStatus,
  shouldArchive,
  mergeVacancyUpdate,
  isCronAuthorized,
  parseDateText,
} from '../index.js';

test('normalizes a new official vacancy record', () => {
  const record = normalizeVacancy({
    sourceName: 'MPESB',
    sourceDomain: 'esb.mp.gov.in',
    sourcePageUrl: 'https://esb.mp.gov.in/student_dashboard.htm',
    title: 'MPESB Junior Assistant Recruitment 2026',
    department: 'MPESB',
    organization: 'Madhya Pradesh Employee Selection Board',
    advertisementNumber: '01/2026',
    startDate: '10-08-2026',
    lastDate: '25-08-2026',
    qualification: 'Graduate',
    totalPosts: 120,
    notificationUrl: 'https://esb.mp.gov.in/student_dashboard.htm',
    applyUrl: 'https://esb.mp.gov.in/apply',
    state: 'Madhya Pradesh',
    category: 'Government',
  });

  assert.equal(record.status, 'upcoming');
  assert.equal(record.verificationStatus, 'auto_verified');
  assert.equal(record.sourceKey, 'https://esb.mp.gov.in/student_dashboard.htm|01/2026');
  assert.equal(record.title, 'MPESB Junior Assistant Recruitment 2026');
  assert.ok(record.contentHash);
});

test('builds stable deduplication keys', () => {
  const a = buildSourceKey({
    sourceDomain: 'mppsc.mp.gov.in',
    advertisementNumber: 'Advt. 05/2026',
    sourcePageUrl: 'https://mppsc.mp.gov.in/Advertisement',
  });

  const b = buildSourceKey({
    sourceDomain: 'mppsc.mp.gov.in',
    advertisementNumber: 'advt. 05/2026',
    sourcePageUrl: 'https://mppsc.mp.gov.in/Advertisement',
  });

  assert.equal(a, b);
  assert.match(a, /mppsc\.mp\.gov\.in/);
});

test('rejects unofficial and invalid links', () => {
  const result = validateVacancy({
    title: 'Test vacancy',
    department: 'MP Police',
    organization: 'Government of Madhya Pradesh',
    notificationUrl: 'https://example.com/not-official',
    sourceDomain: 'example.com',
    lastDate: '2026-09-15',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes('approved domain')));
});

test('parses Hindi and English dates', () => {
  assert.deepEqual(parseDateText('21 August 2026'), new Date('2026-08-21T00:00:00.000Z'));
  assert.deepEqual(parseDateText('25-08-2026'), new Date('2026-08-25T00:00:00.000Z'));
  assert.equal(parseDateText('invalid-date'), null);
});

test('archives expired vacancies', () => {
  const record = {
    lastDate: '2024-01-15',
    status: 'active',
  };

  assert.equal(shouldArchive(record), true);
  assert.equal(calculateStatus({ startDate: '2024-01-10', lastDate: '2024-01-15' }).status, 'closed');
});

test('updates a vacancy without creating a duplicate record', () => {
  const original = {
    title: 'MPPSC Assistant Engineer',
    department: 'Public Service Commission',
    sourceKey: 'https://mppsc.mp.gov.in/Advertisement|MPPSC/2026',
    lastDate: '2026-08-20',
    totalPosts: 25,
    revisionHistory: [],
    relatedUpdates: [],
  };

  const updated = mergeVacancyUpdate(original, {
    lastDate: '2026-08-31',
    totalPosts: 30,
  });

  assert.equal(updated.isUpdated, true);
  assert.equal(updated.lastDate, '2026-08-31');
  assert.equal(updated.revisionHistory.length, 2);
  assert.ok(updated.relatedUpdates.includes('last_date_extended'));
});

test('reactivates an expired vacancy when a corrected last date is extended', () => {
  const status = calculateStatus({
    startDate: '2026-08-01',
    lastDate: '2026-08-31',
    status: 'closed',
    revisionHistory: [{ field: 'lastDate', previous: '2026-08-20' }],
  });

  assert.equal(status.status, 'active');
  assert.equal(status.isUpdated, true);
});

test('cron secret middleware accepts only valid bearer tokens', () => {
  assert.equal(isCronAuthorized('Bearer valid-secret', 'valid-secret'), true);
  assert.equal(isCronAuthorized('Bearer wrong-secret', 'valid-secret'), false);
  assert.equal(isCronAuthorized(undefined, 'valid-secret'), false);
});
