


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const cookieParser = require('cookie-parser');
// require('dotenv').config();

// // Import routes
// const authRoutes = require('./routes/auth');
// const investmentRoutes = require('./routes/investment');
// const dashboardRoutes = require('./routes/dashboard');
// const referralRoutes = require('./routes/referral');

// // Import middleware
// const errorHandler = require('./middleware/error');

// const app = express();

// // 1. DATABASE CONNECTION (Serverless Optimized)
// let cachedDb = null;

// const connectDB = async () => {
//   if (cachedDb) {
//     return cachedDb;
//   }

//   try {
//     // Set strictQuery for Mongoose 7/8 compatibility
//     mongoose.set('strictQuery', true);
    
//     const db = await mongoose.connect(process.env.MONGODB_URI, {
//       serverSelectionTimeoutMS: 5000, // Fail fast if connection is bad
//     });
    
//     cachedDb = db;
//     console.log('MongoDB Connected Successfully');
//     return db;
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     // Don't exit process in production/serverless; throw so the request fails cleanly
//     if (process.env.NODE_ENV !== 'production') process.exit(1);
//     throw error;
//   }
// };

// connectDB()

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // CORS configuration (Optimized for both localhost and Vercel)
// app.use(cors({
//   origin: true, // Echoes back the request origin; required for credentials: true
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // 3. DB CONNECTION MIDDLEWARE
// // This ensures the DB is connected BEFORE any route logic runs
// // app.use(async (req, res, next) => {
// //   try {
// //     await connectDB();
// //     next();
// //   } catch (err) {
// //     res.status(500).json({ success: false, error: 'Database Connection Error' });
// //   }
// // });

// // 4. ROUTES
// app.use('/api/auth', authRoutes);
// app.use('/api/investments', investmentRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/referrals', referralRoutes);

// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is running',
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// // Error handling should be the last middleware


// // 5. SERVER EXECUTION
// if (process.env.NODE_ENV !== 'production') {
//   // Local development
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Local Server running on port ${PORT}`);
//     // Only schedule cron jobs in local/long-running server
//     const { scheduleDailyROI, scheduleWeeklyReport } = require('./utils/cronJobs');
//     scheduleDailyROI();
//     scheduleWeeklyReport();
//   });
// }

// // Export for Vercel
// module.exports = app;