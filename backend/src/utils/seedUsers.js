import dotenv from 'dotenv';
import { connectDB } from './db.js';
import User from '../models/User.js';
import AgentProfile from '../models/AgentProfile.js';

dotenv.config();

const configuredUsers = [
  {
    name: process.env.ADMIN_DEFAULT_NAME,
    email: process.env.ADMIN_DEFAULT_EMAIL,
    phone: process.env.ADMIN_DEFAULT_PHONE,
    password: process.env.ADMIN_DEFAULT_PASSWORD,
    role: 'admin'
  },
  {
    name: process.env.AGENT_DEFAULT_NAME,
    email: process.env.AGENT_DEFAULT_EMAIL,
    phone: process.env.AGENT_DEFAULT_PHONE,
    password: process.env.AGENT_DEFAULT_PASSWORD,
    role: 'agent'
  },
  {
    name: process.env.CUSTOMER_DEFAULT_NAME,
    email: process.env.CUSTOMER_DEFAULT_EMAIL,
    phone: process.env.CUSTOMER_DEFAULT_PHONE,
    password: process.env.CUSTOMER_DEFAULT_PASSWORD,
    role: 'customer'
  }
];

export async function seedUsers() {
  const usersToCreate = configuredUsers.filter((user) =>
    user.name && user.email && user.phone && user.password
  );
  if (!usersToCreate.length) {
    throw new Error('No bootstrap users configured. Set explicit *_DEFAULT_NAME, *_DEFAULT_EMAIL, *_DEFAULT_PHONE and *_DEFAULT_PASSWORD variables.');
  }

  await connectDB();
  for (const userData of usersToCreate) {
    const email = userData.email.trim().toLowerCase();
    const phone = userData.phone.replace(/\D/g, '');
    if (!/^\d{10}$/.test(phone) || userData.password.length < 12) {
      throw new Error(`Invalid bootstrap configuration for role ${userData.role}; use a 10-digit phone and a password of at least 12 characters.`);
    }

    const existing = await User.findOne({ $or: [{ phone }, { email }] });
    if (existing) {
      console.log(`Skipped existing account for configured role ${userData.role}; no role or password changes were made.`);
      continue;
    }

    const created = await User.create({
      name: userData.name.trim(),
      email,
      phone,
      password: userData.password,
      role: userData.role,
      isVerified: false,
      isPhoneVerified: false
    });

    if (userData.role === 'agent') {
      await AgentProfile.create({
        user: created._id,
        agentCode: `PDS-AGT-${Date.now().toString().slice(-8)}`,
        shopName: 'Pending Kiosk Verification',
        businessName: created.name,
        kycStatus: 'pending',
        isVerified: false
      });
    }
    console.log(`Created configured ${userData.role} account.`);
  }
  console.log('Bootstrap user creation completed.');
}

if (process.argv[1]?.endsWith('seedUsers.js')) {
  seedUsers().then(() => process.exit(0)).catch((error) => {
    console.error('Bootstrap user creation failed:', error.message);
    process.exit(1);
  });
}
