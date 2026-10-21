import dotenv from 'dotenv';
import { connectDB } from './db.js';
import Vacancy from '../models/Vacancy.js';
import { MASTER_VACANCIES } from '../data/masterVacancies.js';

dotenv.config();

export async function seedVacancies() {
  console.log('--- Starting Safe Vacancies Seed / Migration ---');
  try {
    await connectDB();

    console.log(`Upserting ${MASTER_VACANCIES.length} Verified Master Vacancies...`);
    for (const v of MASTER_VACANCIES) {
      await Vacancy.updateOne(
        { slug: v.slug },
        { $set: v },
        { upsert: true }
      );
    }
    console.log('✓ Master Vacancies upserted successfully.');
    console.log('--- Vacancies Seed / Migration Complete ---');
    return { success: true, count: MASTER_VACANCIES.length };
  } catch (error) {
    console.error('Error during vacancies seeding:', error);
    throw error;
  }
}

// Standalone execution
if (process.argv[1]?.endsWith('seedVacancies.js')) {
  seedVacancies().then(() => {
    console.log('Exiting seed process.');
    process.exit(0);
  }).catch((err) => {
    console.error('Seed process failed:', err);
    process.exit(1);
  });
}
