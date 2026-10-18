import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const secret =
      process.env.JWT_SECRET ||
      (process.env.NODE_ENV !== 'production'
        ? 'dev-only-jwt-secret-change-before-production'
        : undefined);
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: 'Authentication is not configured properly'
      });
    }
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is active
    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is not active'
      });
    }

    // Check if user is blocked
    if (req.user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'User account has been blocked'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
