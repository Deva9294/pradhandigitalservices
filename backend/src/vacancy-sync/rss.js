import crypto from 'node:crypto';
import Parser from 'rss-parser';
import Vacancy from '../models/Vacancy.js';
import { connectDB } from '../utils/db.js';
import { isApprovedDomain, normalizeDomain, normalizeText, normalizeUrl, validateVacancy } from '../vacancy-sync/index.js';

const parser = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'PradhanDigitalServices-VacancyBot/1.0 (+https://pradhan-frontend-4g39.onrender.com)' },
  customFields: { item: [['deadline', 'deadline'], ['lastDate', 'lastDate'], ['department', 'department']] }
});
const MAX_ITEMS_PER_FEED = 100;

function safeSlug(title, sourceKey) {
  const base = normalizeText(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90) || 'vacancy';
  return `${base}-${crypto.createHash('sha1').update(sourceKey).digest('hex').slice(0, 8)}`;
}

function getFeedUrls() {
  return (process.env.VACANCY_FEED_URLS || '').split(/[;,\n]/).map(x => x.trim()).filter(Boolean);
}

export async function syncRssVacancies() {
  const urls = getFeedUrls();
  const summary = { feedsConfigured: urls.length, feedsRead: 0, inserted: 0, updated: 0, skipped: 0, errors: [] };
  if (!urls.length) {
    console.warn('[RSS Vacancy Sync] VACANCY_FEED_URLS is empty; no feeds were imported.');
    return summary;
  }

  for (const feedUrl of urls) {
    let feedDomain = '';
    try {
      const parsedUrl = new URL(feedUrl);
      if (parsedUrl.protocol !== 'https:' || !isApprovedDomain(parsedUrl.hostname)) {
        summary.skipped++;
        summary.errors.push(`Skipped non-official or non-HTTPS feed: ${parsedUrl.hostname}`);
        continue;
      }
      feedDomain = normalizeDomain(parsedUrl.hostname);
      const response = await fetch(parsedUrl, {
        headers: { 'User-Agent': 'PradhanDigitalServices-VacancyBot/1.0', Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
        signal: AbortSignal.timeout(20000)
      });
      if (!response.ok) throw new Error(`Feed returned HTTP ${response.status}`);
      const xml = await response.text();
      if (xml.length > 5_000_000) throw new Error('Feed is larger than the 5 MB safety limit');
      const feed = await parser.parseString(xml);
      summary.feedsRead++;

      for (const item of (feed.items || []).slice(0, MAX_ITEMS_PER_FEED)) {
        try {
          const title = normalizeText(item.title || '');
          const link = normalizeUrl(item.link || item.guid || '');
          if (!title || !link || !link.startsWith('https://')) { summary.skipped++; continue; }
          const linkDomain = normalizeDomain(new URL(link).hostname);
          if (!isApprovedDomain(linkDomain)) { summary.skipped++; continue; }
          if (/\b(result|merit list|admit card|answer key|appointment order)\b/i.test(title)) { summary.skipped++; continue; }

          const sourceKey = link.replace(/\/$/, '');
          const department = normalizeText(item.department || feed.title || feedDomain).slice(0, 160);
          const published = item.isoDate || item.pubDate || item.date || null;
          const publishedAt = published && !Number.isNaN(new Date(published).getTime()) ? new Date(published) : new Date();
          const record = {
            title,
            slug: safeSlug(title, sourceKey),
            shortDescription: normalizeText(item.contentSnippet || item.summary || item.content || '').slice(0, 1200),
            department,
            organization: department,
            recruitingAuthority: department,
            vacancyType: 'state',
            locationScope: 'MP',
            state: 'Madhya Pradesh',
            category: 'government',
            qualificationLevel: 'Other',
            sourceName: normalizeText(feed.title || feedDomain).slice(0, 120),
            sourceDomain: feedDomain,
            sourcePageUrl: link,
            notificationUrl: link,
            applyUrl: '',
            sourceKey,
            publishedAt,
            firstSeenAt: new Date(),
            lastSeenAt: new Date(),
            lastCheckedAt: new Date(),
            confidenceScore: 0.75,
            isActive: true,
            isNewlyAdded: true,
            status: 'active',
            verificationStatus: 'auto_verified',
            syncMetadata: { sourceName: feed.title || feedDomain, sourceDomain: feedDomain, sourcePageUrl: link, sourceKey, parserVersion: 'rss-parser', lastSyncAt: new Date() }
          };
          const validation = validateVacancy(record);
          if (!validation.valid) { summary.skipped++; continue; }

          const existing = await Vacancy.findOne({ sourceKey }).select('_id title').lean();
          if (existing) {
            await Vacancy.updateOne({ _id: existing._id }, { $set: {
              shortDescription: record.shortDescription,
              sourceName: record.sourceName,
              sourceDomain: record.sourceDomain,
              sourcePageUrl: record.sourcePageUrl,
              notificationUrl: record.notificationUrl,
              lastSeenAt: new Date(),
              lastCheckedAt: new Date(),
              'syncMetadata.lastSyncAt': new Date()
            } });
            summary.updated++;
          } else {
            await Vacancy.create(record);
            summary.inserted++;
          }
        } catch (itemError) {
          summary.skipped++;
          summary.errors.push(`Item in ${feedDomain}: ${itemError.message}`);
        }
      }
    } catch (error) {
      summary.errors.push(`${feedDomain || feedUrl}: ${error.message}`);
    }
  }
  console.log('[RSS Vacancy Sync]', JSON.stringify(summary));
  return summary;
}
