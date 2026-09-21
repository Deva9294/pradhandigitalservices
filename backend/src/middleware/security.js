import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppError } from '../utils/AppError.js';

// Rate limiting configuration
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for API endpoints
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: {
    success: false,
    message: 'Too many API requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Sanitize input to prevent XSS
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove potentially dangerous characters
        req.body[key] = req.body[key]
          .replace(/[<>]/g, '')
          .trim();
      }
    });
  }
  next();
};

// Prevent NoSQL injection
export const preventNoSQLInjection = (req, res, next) => {
  const checkForInjection = (obj) => {
    if (typeof obj === 'string') {
      if (obj.includes('$') || obj.includes('{') || obj.includes('}')) {
        return true;
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (checkForInjection(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };

  if (checkForInjection(req.body) || checkForInjection(req.query)) {
    throw new AppError('Invalid input detected', 400);
  }

  next();
};

// Mask sensitive data in logs
export const maskSensitiveData = (data) => {
  const sensitiveFields = [
    'password',
    'otp',
    'aadhaar',
    'pan',
    'phone',
    'email',
    'token',
    'secret',
    'key'
  ];

  if (typeof data === 'object' && data !== null) {
    const masked = { ...data };
    Object.keys(masked).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        if (typeof masked[key] === 'string') {
          masked[key] = masked[key].substring(0, 2) + '***' + masked[key].substring(masked[key].length - 2);
        }
      }
    });
    return masked;
  }

  return data;
};

// Validate API key
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    throw new AppError('API key is required', 401);
  }

  // In production, validate against database
  const validApiKey = process.env.API_KEY;
  if (validApiKey && apiKey !== validApiKey) {
    throw new AppError('Invalid API key', 401);
  }

  next();
};