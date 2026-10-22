import mongoose from 'mongoose';

// Disable infinite query buffering so queries fail fast with clear diagnostics
mongoose.set('bufferCommands', false);

let isConnecting = false;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (isConnecting) return;
  isConnecting = true;

  const rawUri = process.env.MONGODB_URI?.trim();

  if (!rawUri || rawUri.includes('localhost:27017')) {
    console.warn('⚠️ [MongoDB Notice] MONGODB_URI is missing or pointing to localhost.');
    console.warn('👉 On Render: Add MONGODB_URI in Render Dashboard > Environment.');
    console.warn('   Format: mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/pradhandigitalservices?retryWrites=true&w=majority');
  }

  if (rawUri && rawUri.includes('<password>')) {
    console.error('❌ [MongoDB Error] MONGODB_URI contains literal "<password>" placeholder. Replace it with your real MongoDB Atlas user password.');
  }

  const uri = rawUri || 'mongodb://localhost:27017/pradhan-digital';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Enforce IPv4 on cloud environments (Render/Atlas)
      autoIndex: true,
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    isConnecting = false;
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    throw error;
  }
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
