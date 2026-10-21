import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './db.js';
import User from '../models/User.js';
import AgentProfile from '../models/AgentProfile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback

export async function seedUsers() {
  console.log('--- Starting Systematic Users Seed / Bootstrap ---');
  try {
    await connectDB();

    const usersToSeed = [
      {
        name: "Ravi Pradhan",
        email: "help@pradhandigitalservices.in",
        phone: "9294899787",
        rawPassword: process.env.ADMIN_DEFAULT_PASSWORD || "Admin@Password2026",
        role: "admin",
        isVerified: true
      },
      {
        name: "PDS Kiosk Operator",
        email: "agent@pradhandigitalservices.in",
        phone: "9826012345",
        rawPassword: process.env.AGENT_DEFAULT_PASSWORD || "Agent@Password2026",
        role: "agent",
        isVerified: true,
        agentCode: "PDS-AGT-001",
        shopName: "Pradhan Digital Seva Kendra, Rehti"
      },
      {
        name: "Rahul Sharma",
        email: "customer@pradhandigitalservices.in",
        phone: "9131098765",
        rawPassword: process.env.CUSTOMER_DEFAULT_PASSWORD || "Customer@Password2026",
        role: "customer",
        isVerified: true
      }
    ];

    for (const u of usersToSeed) {
      let existingUser = await User.findOne({ 
        $or: [{ phone: u.phone }, { email: u.email }] 
      }).select('+password');

      if (!existingUser) {
        console.log(`Creating default ${u.role}: ${u.name} (${u.phone})...`);
        const created = await User.create({
          name: u.name,
          email: u.email,
          phone: u.phone,
          password: u.rawPassword,
          role: u.role,
          isVerified: true,
          isPhoneVerified: true
        });

        if (u.role === 'agent') {
          await AgentProfile.updateOne(
            { user: created._id },
            {
              $set: {
                user: created._id,
                agentCode: u.agentCode || "PDS-AGT-001",
                shopName: u.shopName || "Digital Seva Center",
                businessName: "Pradhan Digital Services Kiosk",
                kycStatus: "verified"
              }
            },
            { upsert: true }
          );
        }
      } else {
        console.log(`User already exists: ${existingUser.name} (${existingUser.phone}) with role ${existingUser.role}. Updating role if needed...`);
        existingUser.role = u.role;
        existingUser.isVerified = true;
        // Ensure password is set
        if (!existingUser.password) {
          existingUser.password = u.rawPassword;
        }
        await existingUser.save();

        if (u.role === 'agent') {
          await AgentProfile.updateOne(
            { user: existingUser._id },
            {
              $set: {
                user: existingUser._id,
                agentCode: u.agentCode || "PDS-AGT-001",
                shopName: u.shopName || "Digital Seva Center",
                kycStatus: "verified"
              }
            },
            { upsert: true }
          );
        }
      }
    }

    console.log('✓ Systematic Users seeded / updated successfully.');
    console.log('--- User Seed Complete ---');
    return { success: true };
  } catch (error) {
    console.error('Error during users seeding:', error);
    throw error;
  }
}

// Standalone execution
if (process.argv[1]?.endsWith('seedUsers.js')) {
  seedUsers().then(() => {
    console.log('Exiting user seed process.');
    process.exit(0);
  }).catch((err) => {
    console.error('Seed process failed:', err);
    process.exit(1);
  });
}
