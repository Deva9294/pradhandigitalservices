import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter, authRateLimiter, apiRateLimiter, securityHeaders, sanitizeInput, preventNoSQLInjection } from './middleware/security.js';

// Routes
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB (optional for testing)
connectDB().catch((error) => {
  console.log('⚠️ MongoDB connection failed. Running without database.');
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3002',
  credentials: true
}));
app.use(securityHeaders);
app.use(rateLimiter);
app.use(sanitizeInput);
app.use(preventNoSQLInjection);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Routes
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pradhan Digital Services API is running' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
