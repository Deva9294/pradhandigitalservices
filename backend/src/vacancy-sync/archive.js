import { shouldArchive } from './index.js';

export async function archiveExpiredVacancies(Vacancy) {
  const expired = await Vacancy.find({
    status: { $in: ['active', 'upcoming'] },
    lastDate: { $exists: true, $ne: null },
  });

  const updates = [];
  for (const vacancy of expired) {
    if (shouldArchive(vacancy.toObject())) {
      vacancy.status = 'archived';
      vacancy.closedAt = vacancy.closedAt || new Date();
      vacancy.isUpdated = true;
      vacancy.lastSeenAt = new Date();
      await vacancy.save();
      updates.push(vacancy._id.toString());
    }
  }

  return updates;
}
