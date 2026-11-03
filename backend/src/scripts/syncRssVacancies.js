import { connectDB } from '../utils/db.js';
import { syncRssVacancies } from '../vacancy-sync/rss.js';

try {
  await connectDB();
  const summary = await syncRssVacancies();
  console.log('[RSS Vacancy Cron] Finished:', JSON.stringify(summary));
  await (await import('mongoose')).default.disconnect();
  if (summary.errors.length && summary.feedsRead === 0) process.exitCode = 1;
} catch (error) {
  console.error('[RSS Vacancy Cron] Failed:', error);
  process.exitCode = 1;
  try { await (await import('mongoose')).default.disconnect(); } catch {}
}
