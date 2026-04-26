require('dotenv').config();
// Instant JWT secret cleaning to avoid race conditions
if (process.env.JWT_SECRET) {
  process.env.JWT_SECRET = process.env.JWT_SECRET.replace(/['"]+/g, '').trim();
}

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

// JWT Secret Robustness Check
if (!process.env.JWT_SECRET) {
  logger.error('❌ CRITICAL: JWT_SECRET is not defined in .env');
} else {
  // Clean secret of any accidental quotes or whitespace
  process.env.JWT_SECRET = process.env.JWT_SECRET.replace(/['"]+/g, '').trim();
  console.log(`✅ JWT Secret Loaded: ${process.env.JWT_SECRET.substring(0, 3)}...`);
}

// Mongo URI Robustness Check
if (process.env.MONGO_URI) {
  process.env.MONGO_URI = process.env.MONGO_URI.replace(/['"]+/g, '').trim();
}


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
const sellerController = require('./controllers/sellerController');
const { protect } = require('./middleware/authMiddleware');



// Import Models for Admin auto-creation
const User = require('./models/User');

const app = express();

// 1. CORS & Security Prep (Must be first for browser preflights)
const allowedOrigins = [
  'https://grocomart.netlify.app',
  'https://grocery-grocery.vercel.app',
  'https://grocery-store-1-sgws.onrender.com',
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

app.use(helmet({
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Required for image loading from CDN
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://grocery-store-ue2n.onrender.com"]
    }
  }
}));
app.use(compression()); // Gzip compression
app.use(morgan('dev')); // Dev logging
morganBody(app); // Full request/response logging

// Default rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000,
  message: { error: "Too many requests, please try again later." }
});

// Key generator for IP + Email tracking
const authKeyGenerator = (req) => {
  const email = req.body.email || req.query.email || "anonymous";
  return `${req.ip}-${email}`;
};

// Auth rate limit (Login) - 10 requests per 10 minutes
const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    keyGenerator: authKeyGenerator,
    validate: { default: false },
    message: { error: "Too many login attempts. Please wait 10 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// OTP rate limit (Verify, Reset, Forgot) - 5 requests per 10 minutes
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    keyGenerator: authKeyGenerator,
    validate: { default: false },
    message: { error: "Too many OTP attempts. Please wait 10 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Apply strict limits to sensitive auth endpoints
app.use('/login', authLimiter);
app.use('/verify-otp', otpLimiter);
app.use('/forgot-password', otpLimiter);
app.use('/reset-password', otpLimiter);
app.use('/signup', authLimiter); // Protect signup from bot spam

// 2. Database Connection
connectDB();

/**
 * 3. Admin Auto-Creation
 */
const ensureAdminExists = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        
        // Use findOneAndUpdate to either create or upgrade the user
        const admin = await User.findOneAndUpdate(
            { email: adminEmail },
            { 
                $set: { 
                    is_admin: true, 
                    role: 'admin',
                    sellerStatus: 'ACTIVE',
                    is_verified: true,
                    name: process.env.ADMIN_NAME || 'Admin'
                } 
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (admin.wasNew) {
            console.log("🛠️ Admin account created successfully!");
        } else {
            console.log(`✅ Admin permissions verified for: ${adminEmail}`);
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
app.use('/api/cart', cartRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api', paymentRoutes); // Direct mount for payment order alignment
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/growth', require('./routes/growthRoutes')); // Growth & Personalization
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);

// Global Profile Route (Secure)
app.get('/api/profile/me', protect, sellerController.getProfile); 

// Base route matching Flask logic
app.get('/', (req, res) => {
  res.json({ message: "Welcome to GreenCart API (Node.js)" });
});

// 5. Error Handling Middleware (Production-Hardened)
app.use((err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Log the full stack trace internally for debugging
  logger.error(err.stack);
  
  res.status(500).json({ 
    error: 'An internal server error occurred',
    message: isProduction ? 'Something went wrong on our end.' : err.message,
    // Shield stack trace in production to prevent information leakage
    stack: isProduction ? undefined : err.stack 
  });
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
