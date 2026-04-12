const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI from environment variables.
 * We use Mongoose for structured schema-based mapping, 
 * whereas the Flask app used the raw PyMongo client.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
