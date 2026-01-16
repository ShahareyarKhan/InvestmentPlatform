const Investment = require('../models/Investment');
const User = require('../models/User');
const ROIHistory = require('../models/ROIHistory');

// @desc    Calculate daily ROI for all active investments
// @route   Internal function (called by cron job)
exports.calculateDailyROI = async () => {
  try {
    console.log('Starting daily ROI calculation...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get all active investments
    const activeInvestments = await Investment.find({
      status: 'active',
      isActive: true,
      endDate: { $gt: today }
    }).populate('user');
    
    let totalROICalculated = 0;
    let processedInvestments = 0;
    
    for (const investment of activeInvestments) {
      // Check if ROI was already calculated today
      const lastCalculation = investment.lastROICalculation;
      if (lastCalculation) {
        const lastCalcDate = new Date(lastCalculation);
        lastCalcDate.setHours(0, 0, 0, 0);
        
        if (lastCalcDate.getTime() === today.getTime()) {
          continue; // Already calculated today
        }
      }
      
      // Calculate daily ROI
      const dailyROI = investment.amount * investment.planDetails.dailyROI;
      
      // Update user's wallet and total ROI
      const user = await User.findById(investment.user._id);
      user.walletBalance += dailyROI;
      user.totalROI += dailyROI;
      user.totalEarnings += dailyROI;
      await user.save();
      
      // Update investment
      investment.totalEarned += dailyROI;
      investment.lastROICalculation = new Date();
      await investment.save();
      
      // Record ROI history
      await ROIHistory.create({
        user: investment.user._id,
        investment: investment._id,
        amount: dailyROI,
        type: 'roi',
        description: `Daily ROI from ${investment.plan} plan investment`
      });
      
      totalROICalculated += dailyROI;
      processedInvestments++;
      
      // Check if investment has completed its duration
      const daysActive = Math.floor((today - investment.startDate) / (1000 * 60 * 60 * 24));
      if (daysActive >= investment.planDetails.duration) {
        investment.status = 'completed';
        investment.isActive = false;
        await investment.save();
      }
    }
    
    console.log(`Daily ROI calculation completed. Processed ${processedInvestments} investments. Total ROI: $${totalROICalculated.toFixed(2)}`);
    
    return {
      success: true,
      processedInvestments,
      totalROICalculated
    };
  } catch (error) {
    console.error('Error in daily ROI calculation:', error);
    throw error;
  }
};

// @desc    Process level income for all referrals
// @route   Internal function
exports.processLevelIncome = async () => {
  try {
    console.log('Processing level income...');
    
    // This function would process level income based on referral activities
    // For now, it's integrated with investment creation and ROI calculation
    
    return {
      success: true,
      message: 'Level income processing integrated with other operations'
    };
  } catch (error) {
    console.error('Error in level income processing:', error);
    throw error;
  }
};