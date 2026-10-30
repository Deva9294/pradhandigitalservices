import mongoose from 'mongoose';

// Fail fast instead of silently falling back to a credential committed to source control.
mongoose.set('bufferCommands', false);

let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGODB_URI?.trim();
  if (!uri || !/^mongodb(\+srv)?:\/\//i.test(uri)) {
    throw new Error('MONGODB_URI is required. Configure it in the Render backend Environment settings.');
  }
  if (uri.includes('<password>')) {
    throw new Error('MONGODB_URI contains the literal <password> placeholder.');
  }

  connectionPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
    autoIndex: process.env.NODE_ENV !== 'production',
  }).then((conn) => {
    console.log(`MongoDB connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  }).catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }).finally(() => {
    connectionPromise = null;
  });

  return connectionPromise;
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. The application will reconnect on the next database operation.');
});
