const User = require('../models/User');
const Referral = require('../models/Referral');

// @desc    Get referral tree
// @route   GET /api/referrals/tree
// @access  Private
exports.getReferralTree = async (req, res, next) => {
  try {
    const buildTree = async (userId, level = 1, maxLevel = 4) => {
      if (level > maxLevel) return null;
      
      const user = await User.findById(userId);
      if (!user) return null;
      
      const directReferrals = await User.find({ referredBy: userId });
      
      const treeNode = {
        id: user._id,
        name: user.name,
        email: user.email,
        level: level - 1,
        investmentCount: await getInvestmentCount(userId),
        totalInvestment: await getTotalInvestment(userId),
        referrals: []
      };
      
      for (const referral of directReferrals) {
        const childTree = await buildTree(referral._id, level + 1, maxLevel);
        if (childTree) {
          treeNode.referrals.push(childTree);
        }
      }
      
      return treeNode;
    };
    
    const getInvestmentCount = async (userId) => {
      const Investment = require('../models/Investment');
      return await Investment.countDocuments({
        user: userId,
        status: 'active'
      });
    };
    
    const getTotalInvestment = async (userId) => {
      const Investment = require('../models/Investment');
      const investments = await Investment.find({
        user: userId,
        status: 'active'
      });
      return investments.reduce((sum, inv) => sum + inv.amount, 0);
    };
    
    const referralTree = await buildTree(req.user.id);
    
    res.status(200).json({
      success: true,
      data: referralTree
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get referral statistics
// @route   GET /api/referrals/stats
// @access  Private
exports.getReferralStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get direct referrals
    const directReferrals = await User.find({ referredBy: userId });
    
    // Get referral earnings by level
    const ROIHistory = require('../models/ROIHistory');
    const levelEarnings = await ROIHistory.aggregate([
      {
        $match: {
          user: userId,
          type: 'level_income'
        }
      },
      {
        $group: {
          _id: '$level',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get total referral earnings
    const totalReferralEarnings = levelEarnings.reduce((sum, level) => sum + level.totalAmount, 0);
    
    res.status(200).json({
      success: true,
      data: {
        directReferrals: directReferrals.length,
        levelEarnings,
        totalReferralEarnings,
        referralLink: `${process.env.FRONTEND_URL}/register?ref=${req.user.referralCode}`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get referral link
// @route   GET /api/referrals/link
// @access  Private
exports.getReferralLink = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralLink: `${process.env.FRONTEND_URL}/register?ref=${user.referralCode}`
      }
    });
  } catch (error) {
    next(error);
  }
};