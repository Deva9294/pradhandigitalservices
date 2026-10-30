const path = require('path');
const mongoose = require(path.join(__dirname, '..', 'backend', 'node_modules', 'mongoose'));

const uri = process.env.MONGODB_URI;
if (!uri || !/^mongodb(\\+srv)?:\\/\\//i.test(uri)) {
  console.error('Set a valid MONGODB_URI environment variable before running this diagnostic.');
  process.exit(1);
}

async function test() {
  try {
    console.log('Connecting to MongoDB using the configured environment variable...');
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, family: 4 });
    console.log('Connected successfully. Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    await mongoose.disconnect();
  } catch (err) {
    console.error('MongoDB connection test failed:', err.message);
    process.exitCode = 1;
  }
}

test();
