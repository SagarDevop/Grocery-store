require('dotenv').config();
const dns = require('dns');
// Force Node to use Google Public DNS to resolve MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import Models for Admin auto-creation
const User = require('./models/User');

const app = express();

// 1. Database Connection
connectDB();

/**
 * 2. Admin Auto-Creation
 * Replicates the logic at the start of app.py to ensure the default admin exists.
 */
const ensureAdminExists = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            console.log("🛠️ Admin account not found. Creating default admin...");
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await User.create({
                name: process.env.ADMIN_NAME,
                email: adminEmail,
                password: hashedPassword,
                is_admin: true,
                is_verified: true,
                role: 'user', // Default role 'user' but is_admin flag is set
                cart: []
            });
            console.log("✅ Admin account created successfully!");
        } else {
            console.log("✅ Admin account verified.");
        }
    } catch (error) {
        console.error("❌ Error ensuring admin setup:", error);
    }
};
ensureAdminExists();

// 3. Middlewares
// CORS setup: In Flask, we had domains: https://grocomart.netlify.app, https://grocery-grocery.vercel.app
const allowedOrigins = [
  'https://grocomart.netlify.app',
  'https://grocery-grocery.vercel.app',
  'http://localhost:5173' // Local Vite dev server
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (process.env.NODE_ENV === 'development' || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed`);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true // Mandatory for Cookie-based JWT
}));

app.use(express.json()); // Body parser for JSON
app.use(cookieParser()); // Cookie parser for JWT tokens

// 4. Routes Integration
// Note: We use the base '/' for most, but organize into modules
app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', sellerRoutes);
app.use('/', adminRoutes);

// Base route matching Flask logic
app.get('/', (req, res) => {
  res.json({ message: "Welcome to GreenCart API (Node.js)" });
});

// 5. Error Handling Middleware (Basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
