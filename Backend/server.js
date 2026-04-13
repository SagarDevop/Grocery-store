require('dotenv').config();
const dns = require('dns');
// Force Node to use Google Public DNS to resolve MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

// Import Models for Admin auto-creation
const User = require('./models/User');

const app = express();

// 1. CORS & Security Prep (Must be first for browser preflights)
const allowedOrigins = [
  'https://grocomart.netlify.app',
  'https://grocery-grocery.vercel.app',
  'https://grocery-store-1-sgws.onrender.com', // New Frontend URL
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed`);
      return callback(new Error('CORS not allowed'), false);
    }
  },
  credentials: true
}));

app.use(helmet());
app.use(compression()); // Gzip compression
app.use(morgan('dev')); // Dev logging
morganBody(app); // Full request/response logging

// Default rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000,
  message: { error: "Too many requests, please try again later." }
});

// Stricter rate limit for Auth/Sensitive routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many login attempts. Take a breather." }
});

app.use(limiter);
app.use('/signup', authLimiter);
app.use('/login', authLimiter);
app.use('/api/reviews', authLimiter);

// 2. Database Connection
connectDB();

/**
 * 3. Admin Auto-Creation
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

app.use(express.json()); // Body parser for JSON
app.use(cookieParser()); // Cookie parser for JWT tokens

// 4. Routes Integration
// Note: We use the base '/' for most, but organize into modules
app.use('/', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', require('./routes/couponRoutes')); // New Coupon Engine
app.use('/', cartRoutes);
app.use('/', sellerRoutes);
app.use('/', adminRoutes);
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/growth', require('./routes/growthRoutes')); // Growth & Personalization
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);

// Base route matching Flask logic
app.get('/', (req, res) => {
  res.json({ message: "Welcome to GreenCart API (Node.js)" });
});

// 5. Error Handling Middleware (Basic)
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // SELF-PING LOGIC (to prevent Render sleep)
  const axios = require('axios');
  const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
  const backendUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

  setInterval(async () => {
    try {
      console.log('📡 Self-pinging to keep server alive...');
      await axios.get(`${backendUrl}/api/ping`);
      console.log('✅ Self-ping successful');
    } catch (err) {
      console.error('❌ Self-ping failed:', err.message);
    }
  }, PING_INTERVAL);
});

// Helper route for pinging
app.get('/api/ping', (req, res) => {
  res.json({ status: 'alive', timestamp: new Date() });
});
