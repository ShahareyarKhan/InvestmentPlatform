// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const cookieParser = require('cookie-parser');
// require('dotenv').config();

// // Import routes
// const authRoutes = require('./routes/auth');
// const investmentRoutes = require('./routes/investment');
// const dashboardRoutes = require('./routes/dashboard');
// const referralRoutes = require('./routes/referral');

// // Import middleware
// const errorHandler = require('./middleware/error');

// // Import cron jobs
// const { scheduleDailyROI, scheduleWeeklyReport } = require('./utils/cronJobs');

// // Initialize express
// const app = express();

// // Body parser
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Cookie parser
// app.use(cookieParser());

// // Security middleware
// app.use(helmet());

// // CORS configuration
// const corsOptions = {
//   origin: function (origin, callback) {
//     // List of allowed origins
//     const allowedOrigins = [
//       'http://localhost:3000',
//       'https://investment-platform-shahareyar.vercel.app',
//       'https://investment-platform.vercel.app',
//       'https://investment-platform-shahareyar.vercel.app/'
//       // Add other domains as needed
//     ];
    
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
//   exposedHeaders: ['Content-Range', 'X-Content-Range']
// };

// app.use(cors(corsOptions));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api/', limiter);

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/investments', investmentRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/referrals', referralRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString()
//   });
// });

// // Error handler middleware
// app.use(errorHandler);

// // Database connection
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('MongoDB Connected');
    
//     // Schedule cron jobs after DB connection
//     scheduleDailyROI();
//     scheduleWeeklyReport();
    
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// // Start server
// const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   connectDB();
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   server.close(() => process.exit(1));
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const investmentRoutes = require('./routes/investment');
const dashboardRoutes = require('./routes/dashboard');
const referralRoutes = require('./routes/referral');

// Import middleware
const errorHandler = require('./middleware/error');

// Initialize express
const app = express();

// Simple CORS for now - Fix the issue first
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://investment-platform-shahareyar.vercel.app',
    'https://investment-platform.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
});
app.use('/api/', limiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/referrals', referralRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    allowedOrigins: ['https://investment-platform-shahareyar.vercel.app', 'http://localhost:3000']
  });
});

// Test CORS endpoint
app.post('/api/test-cors', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CORS test successful',
    origin: req.headers.origin,
    body: req.body
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}