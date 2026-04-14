const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Force use of Google DNS if needed (uncommon but sometimes helps in restricted envs)
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const resetDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/grocery_store';
    console.log(`Connecting to MongoDB: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log('Connected to database.');

    const collections = ['users', 'pendingsellers', 'sellers', 'products', 'orders', 'transactions', 'coupons', 'carts', 'pendingusers', 'auditlogs'];
    
    for (const collectionName of collections) {
      try {
        await mongoose.connection.collection(collectionName).deleteMany({});
        console.log(`Successfully cleared collection: ${collectionName}`);
      } catch (err) {
        console.log(`Collection ${collectionName} might not exist or failed to clear: ${err.message}`);
      }
    }

    console.log('--- DATABASE RESET COMPLETE ---');
    console.log('You can now start with fresh registrations.');
    
    process.exit(0);
  } catch (error) {
    console.error('Reset Failed:', error);
    process.exit(1);
  }
};

resetDatabase();
