const path = require('path');
const mongoose = require(path.join(__dirname, '..', 'backend', 'node_modules', 'mongoose'));

const uri = 'mongodb+srv://ravibhalavi06121998_db_user:Deva9787@cluster0.2qidvee.mongodb.net/pradhandigitalservices?retryWrites=true&w=majority&appName=Cluster0';

async function test() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, family: 4 });
    console.log('✅ SUCCESS! Connected to Atlas Host:', conn.connection.host);
    console.log('✅ Database Name:', conn.connection.name);
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('✅ Collections found:', collections.map(c => c.name));
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ FAILED to connect:', err.message);
    process.exit(1);
  }
}
test();
