import mongoose from 'mongoose';

// Disable infinite query buffering so queries fail fast with clear diagnostics
mongoose.set('bufferCommands', false);

let connectionPromise = null;

// Verified Production Cloud MongoDB Atlas Cluster URI for Pradhan Digital Services
const CLOUD_FALLBACK_URI =
  'mongodb+srv://ravibhalavi06121998_db_user:Deva9787@cluster0.2qidvee.mongodb.net/pradhandigitalservices?retryWrites=true&w=majority&appName=Cluster0';

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (connectionPromise) {
    return connectionPromise;
  }

  const rawUri = process.env.MONGODB_URI?.trim();

  // Use environment URI if valid and not pointing to dead localhost, otherwise use verified Atlas Cloud URI
  let uri = (rawUri && !rawUri.includes('localhost:27017')) ? rawUri : CLOUD_FALLBACK_URI;

  // Ensure database name is explicitly pradhandigitalservices rather than default "test"
  if (uri.includes('.mongodb.net/?')) {
    uri = uri.replace('.mongodb.net/?', '.mongodb.net/pradhandigitalservices?');
  }

  if (rawUri && rawUri.includes('<password>')) {
    console.error('❌ [MongoDB Error] MONGODB_URI contains literal "<password>" placeholder. Replace it with your real MongoDB Atlas user password.');
  }

  connectionPromise = (async () => {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000,
        family: 4, // Enforce IPv4 on cloud environments (Render/Atlas)
        autoIndex: true,
      });
      console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);
      connectionPromise = null;
      return conn;
    } catch (error) {
      connectionPromise = null;
      console.error(`❌ MongoDB Connection Failed: ${error.message}`);
      throw error;
    }
  })();

  return connectionPromise;
};

// Auto-reconnect listeners
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting automatic reconnection...');
  setTimeout(() => {
    connectDB().catch((err) => {
      console.error('MongoDB reconnection attempt failed:', err.message);
    });
  }, 5000);
});
