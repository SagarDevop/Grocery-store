const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const dotenv = require('dotenv');
dotenv.config();

console.log("Connecting to:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connection Successful!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection Failed:", err);
    process.exit(1);
  });
