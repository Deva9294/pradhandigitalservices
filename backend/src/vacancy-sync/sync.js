import Vacancy from '../models/Vacancy.js';
import { MASTER_VACANCIES } from '../data/masterVacancies.js';

export async function syncAllVacancies() {
  console.log('[VacancySync] Starting full synchronization with verified catalogue...');
  let updatedCount = 0;
  let insertedCount = 0;

  for (const vacancyData of MASTER_VACANCIES) {
    try {
      const existing = await Vacancy.findOne({ slug: vacancyData.slug });
      if (existing) {
        await Vacancy.updateOne({ slug: vacancyData.slug }, { $set: vacancyData });
        updatedCount++;
      } else {
        await Vacancy.create(vacancyData);
        insertedCount++;
      }
    } catch (err) {
      console.warn(`[VacancySync] Warning while syncing ${vacancyData.slug}:`, err.message);
    }
  }

  console.log(`[VacancySync] Sync completed: ${updatedCount} updated, ${insertedCount} inserted.`);
  return {
    success: true,
    total: MASTER_VACANCIES.length,
    updated: updatedCount,
    inserted: insertedCount,
    syncedAt: new Date(),
  };
}

export default { syncAllVacancies };
