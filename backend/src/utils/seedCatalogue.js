import dotenv from 'dotenv';
import { connectDB } from './db.js';
import DocumentType from '../models/DocumentType.js';
import ServiceCategory from '../models/ServiceCategory.js';
import Service from '../models/Service.js';
import { MASTER_DOCUMENT_TYPES } from '../data/masterDocuments.js';
import { MASTER_CATEGORIES } from '../data/masterCategories.js';
import { MASTER_SERVICES } from '../data/masterCatalogue.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export async function seedCatalogue() {
  console.log('--- Starting Safe Master Catalogue Seed / Migration ---');
  try {
    await connectDB();

    // 1. Seed Master Document Types
    console.log(`Seeding ${MASTER_DOCUMENT_TYPES.length} Master Document Types...`);
    for (const doc of MASTER_DOCUMENT_TYPES) {
      await DocumentType.updateOne(
        { code: doc.code },
        { $set: doc },
        { upsert: true }
      );
    }
    console.log('✓ Master Document Types upserted successfully.');

    // 2. Seed Master Service Categories
    console.log(`Seeding ${MASTER_CATEGORIES.length} Service Categories...`);
    for (const cat of MASTER_CATEGORIES) {
      await ServiceCategory.updateOne(
        { slug: cat.slug },
        { $set: cat },
        { upsert: true }
      );
    }
    console.log('✓ Master Service Categories upserted successfully.');

    // 3. Seed Master Services
    console.log(`Seeding ${MASTER_SERVICES.length} Master Services...`);
    for (const srv of MASTER_SERVICES) {
      // Find category Hindi name for fast display
      const catObj = MASTER_CATEGORIES.find(c => c.slug === srv.category);
      const categoryHi = catObj ? catObj.nameHi : '';

      await Service.updateOne(
        { slug: srv.slug },
        { 
          $set: {
            ...srv,
            categoryHi: srv.categoryHi || categoryHi,
            totalFee: (srv.governmentFee || 0) + (srv.serviceCharge || 50),
            price: (srv.governmentFee || 0) + (srv.serviceCharge || 50)
          } 
        },
        { upsert: true }
      );
    }
    console.log('✓ Master Services upserted successfully.');

    console.log('--- Master Catalogue Seed / Migration Complete ---');
    return { success: true };
  } catch (error) {
    console.error('Error during catalogue seeding:', error);
    throw error;
  }
}

// Run standalone if called directly
if (process.argv[1]?.endsWith('seedCatalogue.js')) {
  seedCatalogue().then(() => {
    console.log('Exiting seed process.');
    process.exit(0);
  }).catch((err) => {
    console.error('Seed process failed:', err);
    process.exit(1);
  });
}
