import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter, sanitizeInput, preventNoSQLInjection, securityHeaders } from './middleware/security.js';

import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/upload.js';
import rechargeRoutes from './routes/recharge.js';
import vacancyRoutes from './routes/vacancies.js';
import formRoutes from './routes/forms.js';
import applicationRoutes from './routes/applications.js';
import schemeRoutes from './routes/schemes.js';
import admitCardRoutes from './routes/admitCards.js';
import resultRoutes from './routes/results.js';
import examEventRoutes from './routes/examEvents.js';
import documentToolRoutes from './routes/documentTools.js';
import supportRoutes from './routes/support.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payments.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

// Resilient JWT_SECRET handling in production
const jwtSecret = process.env.JWT_SECRET || 'pds_production_super_secure_jwt_secret_token_key_2026';
if (jwtSecret.length < 32) {
  console.warn('⚠️ Warning: JWT_SECRET should ideally be at least 32 characters in production.');
}

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 8000;

app.set('trust proxy', 1);

connectDB().then(async () => {
  try {
    const Service = (await import('./models/Service.js')).default;
    const count = await Service.countDocuments();
    if (count < 20) {
      console.log('🔄 Initializing Master Service Catalogue...');
      const { seedCatalogue } = await import('./utils/seedCatalogue.js');
      await seedCatalogue();
    }
    try {
      const { seedVacancies } = await import("./utils/seedVacancies.js");
      await seedVacancies();
    } catch (vErr) {
      console.error("Vacancies sync notice:", vErr.message);
    }
  } catch (err) {
    console.error('Catalogue initialization notice:', err.message);
  }
}).catch(() => {
  console.log('⚠️ MongoDB connection failed. Running without database.');
});

// Resilient CORS configuration for Render, Vercel, and Production domains
const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:8000',
  'https://pradhandigitalservices.in',
  'https://www.pradhandigitalservices.in'
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (
        configuredOrigins.includes(origin) ||
        defaultAllowedOrigins.includes(origin) ||
        origin.endsWith('.onrender.com') ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      console.warn('[CORS Allowed with warning for Render/Domain]:', origin);
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(securityHeaders);
app.use(rateLimiter);
app.use(sanitizeInput);
app.use(preventNoSQLInjection);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/recharge', rechargeRoutes);
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/admit-cards', admitCardRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/exam-events', examEventRoutes);
app.use('/api/document-tools', documentToolRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);

// Render Health & Status Endpoints
app.get(['/', '/health'], (req, res) => {
  res.json({ status: 'ok', service: 'Pradhan Digital Services Backend API', timestamp: new Date() });
});

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const rawUri = process.env.MONGODB_URI || '';

  res.json({
    status: dbState === 1 ? 'ok' : 'degraded',
    service: 'Pradhan Digital Services Backend API',
    database: {
      status: states[dbState] || 'unknown',
      readyState: dbState,
      isConfigured: Boolean(rawUri && !rawUri.includes('localhost')),
      uriType: rawUri.startsWith('mongodb+srv://') ? 'Atlas Cloud' : (rawUri ? 'Custom' : 'None (Default Localhost)'),
      hasPasswordPlaceholder: rawUri.includes('<password>'),
      troubleshooting: dbState !== 1 ? 'Add MONGODB_URI to Render Dashboard > Environment, and in MongoDB Atlas > Network Access > add 0.0.0.0/0' : undefined
    },
    timestamp: new Date()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
