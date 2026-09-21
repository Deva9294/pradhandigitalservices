export function makeSyncLog(source, summary = {}) {
  return {
    source,
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    durationMs: 0,
    httpStatus: summary.httpStatus || 200,
    recordsDiscovered: Number(summary.recordsDiscovered || 0),
    recordsInserted: Number(summary.recordsInserted || 0),
    recordsUpdated: Number(summary.recordsUpdated || 0),
    recordsSkipped: Number(summary.recordsSkipped || 0),
    recordsSentToReview: Number(summary.recordsSentToReview || 0),
    errorMessage: summary.errorMessage || '',
    parserVersion: 'vacancy-sync-v1',
  };
}

export function appendLog(logs, item) {
  return [...(Array.isArray(logs) ? logs : []), item];
}
