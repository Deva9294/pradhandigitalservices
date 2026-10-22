import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';
import Service from '../models/Service.js';
import ServiceCategory from '../models/ServiceCategory.js';
import DocumentType from '../models/DocumentType.js';
import { MASTER_DOCUMENT_TYPES } from '../data/masterDocuments.js';
import { MASTER_CATEGORIES } from '../data/masterCategories.js';
import { MASTER_SERVICES } from '../data/masterCatalogue.js';

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
    const docOps = MASTER_DOCUMENT_TYPES.map(doc => ({
      updateOne: {
        filter: { code: doc.code },
        update: { $set: doc },
        upsert: true
      }
    }));
    if (docOps.length > 0) {
      await DocumentType.bulkWrite(docOps);
    }
    console.log('✓ Master Document Types upserted successfully.');

    // 2. Seed Master Service Categories
    console.log(`Seeding ${MASTER_CATEGORIES.length} Service Categories...`);
    const catOps = MASTER_CATEGORIES.map(cat => ({
      updateOne: {
        filter: { slug: cat.slug },
        update: { $set: cat },
        upsert: true
      }
    }));
    if (catOps.length > 0) {
      await ServiceCategory.bulkWrite(catOps);
    }
    console.log('✓ Master Service Categories upserted successfully.');

    // 3. Seed Master Services (Bulk Write for high performance)
    console.log(`Seeding ${MASTER_SERVICES.length} Master Services in bulk...`);
    const srvOps = MASTER_SERVICES.map(srv => {
      const catObj = MASTER_CATEGORIES.find(c => c.slug === srv.category);
      const categoryHi = catObj ? catObj.nameHi : '';
      return {
        updateOne: {
          filter: { slug: srv.slug },
          update: {
            $set: {
              ...srv,
              categoryHi: srv.categoryHi || categoryHi,
              totalFee: (srv.governmentFee || 0) + (srv.serviceCharge || 50),
              price: (srv.governmentFee || 0) + (srv.serviceCharge || 50)
            }
          },
          upsert: true
        }
      };
    });
    if (srvOps.length > 0) {
      await Service.bulkWrite(srvOps);
    }
    console.log('✓ Master Services bulk upserted successfully.');

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
