const Investment = require('../models/Investment');
const ROIHistory = require('../models/ROIHistory');
const User = require('../models/User');

// @desc    Get dashboard data
// @route   GET /api/dashboard/data
// @access  Private
exports.getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get active investments
    const activeInvestments = await Investment.find({
      user: userId,
      status: 'active',
      isActive: true
    });
    
    // Calculate total investment
    const totalInvestment = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    
    // Calculate today's expected ROI
    const todayROI = activeInvestments.reduce((sum, inv) => {
      const dailyROI = inv.amount * inv.planDetails.dailyROI;
      return sum + dailyROI;
    }, 0);
    
    // Get recent ROI history
    const recentROI = await ROIHistory.find({
      user: userId,
      type: { $in: ['roi', 'level_income'] }
    })
    .sort({ date: -1 })
    .limit(10)
    .populate('investment', 'plan');
    
    // Get user stats
    const user = await User.findById(userId);
    
    // Get referral count
    const referralCount = await User.countDocuments({ referredBy: userId });
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          walletBalance: user.walletBalance,
          totalEarnings: user.totalEarnings,
          levelIncome: user.levelIncome,
          totalROI: user.totalROI
        },
        investments: {
          active: activeInvestments.length,
          totalInvestment,
          todayROI
        },
        referrals: {
          count: referralCount,
          earnings: user.levelIncome
        },
        recentTransactions: recentROI
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ROI history
// @route   GET /api/dashboard/roi-history
// @access  Private
exports.getROIHistory = async (req, res, next) => {
  try {
    const { type, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    const query = { user: req.user.id };
    
    if (type) {
      query.type = type;
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const skip = (page - 1) * limit;
    
    const history = await ROIHistory.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('investment', 'plan amount')
      .populate('referredUser', 'name email');
    
    const total = await ROIHistory.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: history.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get earnings summary
// @route   GET /api/dashboard/earnings-summary
// @access  Private
exports.getEarningsSummary = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query; // day, week, month, year
    
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    const earnings = await ROIHistory.aggregate([
      {
        $match: {
          user: req.user._id,
          type: { $in: ['roi', 'level_income'] },
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' }
            }
          },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: earnings
    });
  } catch (error) {
    next(error);
  }
};