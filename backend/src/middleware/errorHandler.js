export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose buffering / connection timeouts gracefully
  if (
    message.includes('buffering timed out') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ENOTFOUND') ||
    err.name === 'MongooseServerSelectionError' ||
    err.name === 'MongooseError'
  ) {
    statusCode = 503;
    message = 'डेटाबेस कनेक्शन उपलब्ध नहीं है (Database connection unavailable). कृपया Render Dashboard में MONGODB_URI जांचें और MongoDB Atlas Network Access में 0.0.0.0/0 IP Whitelist करें।';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack, originalError: err.message })
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
