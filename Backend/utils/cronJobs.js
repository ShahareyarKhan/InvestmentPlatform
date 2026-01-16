const cron = require('node-cron');
const { calculateDailyROI } = require('../controllers/roiCalculator');
const Investment = require('../models/Investment');

// Flag to prevent concurrent execution
let isProcessing = false;

// Schedule daily ROI calculation at midnight
const scheduleDailyROI = () => {
  cron.schedule('0 0 * * *', async () => {
    if (isProcessing) {
      console.log('ROI calculation already in progress. Skipping...');
      return;
    }
    
    try {
      isProcessing = true;
      console.log('Executing scheduled daily ROI calculation...');
      
      const result = await calculateDailyROI();
      console.log('Scheduled ROI calculation result:', result);
      
      // Clean up old completed investments (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      await Investment.deleteMany({
        status: 'completed',
        updatedAt: { $lt: thirtyDaysAgo }
      });
      
    } catch (error) {
      console.error('Error in scheduled ROI calculation:', error);
    } finally {
      isProcessing = false;
    }
  }, {
    scheduled: true,
    timezone: "UTC"
  });
  
  console.log('Daily ROI cron job scheduled (Runs at 00:00 UTC)');
};

// Schedule weekly summary report (every Sunday at 6 AM)
const scheduleWeeklyReport = () => {
  cron.schedule('0 6 * * 0', async () => {
    console.log('Generating weekly report...');
    // Implement weekly reporting logic here
  }, {
    scheduled: true,
    timezone: "UTC"
  });
};

// Manual trigger for testing
const triggerManualROICalculation = async () => {
  if (isProcessing) {
    throw new Error('ROI calculation already in progress');
  }
  
  try {
    isProcessing = true;
    const result = await calculateDailyROI();
    return result;
  } finally {
    isProcessing = false;
  }
};

module.exports = {
  scheduleDailyROI,
  scheduleWeeklyReport,
  triggerManualROICalculation
};