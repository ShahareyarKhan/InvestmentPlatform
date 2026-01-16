const Investment = require('../models/Investment');
const User = require('../models/User');
const ROIHistory = require('../models/ROIHistory');

// @desc    Create new investment
// @route   POST /api/investments
// @access  Private
exports.createInvestment = async (req, res, next) => {
  try {
    const { amount, plan } = req.body;
    
    // Check if user has sufficient wallet balance
    const user = await User.findById(req.user.id);
    
    if (user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient wallet balance'
      });
    }
    
    // Deduct amount from wallet
    user.walletBalance -= amount;
    await user.save();
    
    // Create investment
    const investment = await Investment.create({
      user: req.user.id,
      amount,
      plan
    });
    
    // Record the transaction
    await ROIHistory.create({
      user: req.user.id,
      investment: investment._id,
      amount: -amount,
      type: 'deposit',
      description: `Investment in ${plan} plan`
    });
    
    // Process referral commissions
    await processReferralCommissions(req.user.id, amount);
    
    res.status(201).json({
      success: true,
      data: investment
    });
  } catch (error) {
    next(error);
  }
};

// Process referral commissions
const processReferralCommissions = async (userId, investmentAmount) => {
  const User = require('../models/User');
  const Referral = require('../models/Referral');
  const ROIHistory = require('../models/ROIHistory');
  
  let currentUserId = userId;
  const commissionLevels = 4; // Maximum levels for commissions
  
  for (let level = 1; level <= commissionLevels; level++) {
    // Find who referred this user
    const user = await User.findById(currentUserId);
    
    if (!user || !user.referredBy) {
      break; // No more referrers in chain
    }
    
    const referrer = await User.findById(user.referredBy);
    
    if (!referrer) {
      break;
    }
    
    // Get referrer's active investments to determine commission percentage
    const referrerInvestments = await Investment.find({
      user: referrer._id,
      status: 'active'
    });
    
    if (referrerInvestments.length === 0) {
      currentUserId = referrer._id;
      continue; // Referrer has no active investments
    }
    
    // Find the highest plan for commission calculation
    const highestInvestment = referrerInvestments.sort((a, b) => {
      const planOrder = { 'vip': 3, 'premium': 2, 'basic': 1 };
      return planOrder[b.plan] - planOrder[a.plan];
    })[0];
    
    // Get commission percentage for this level
    const commissionRate = highestInvestment.planDetails.levelCommission
      .find(c => c.level === level)?.percentage || 0;
    
    if (commissionRate > 0) {
      const commissionAmount = (investmentAmount * commissionRate) / 100;
      
      // Update referrer's wallet and level income
      referrer.walletBalance += commissionAmount;
      referrer.levelIncome += commissionAmount;
      referrer.totalEarnings += commissionAmount;
      await referrer.save();
      
      // Record commission
      await ROIHistory.create({
        user: referrer._id,
        amount: commissionAmount,
        type: 'level_income',
        description: `Level ${level} commission from ${user.name}`,
        level: level,
        referredUser: userId
      });
      
      // Update referral record
      await Referral.findOneAndUpdate(
        { referrer: referrer._id, referredUser: userId },
        {
          $inc: { investmentAmount: investmentAmount, commissionEarned: commissionAmount },
          lastCommissionDate: new Date()
        },
        { upsert: true }
      );
    }
    
    currentUserId = referrer._id;
  }
};

// @desc    Get user's investments
// @route   GET /api/investments/my-investments
// @access  Private
exports.getUserInvestments = async (req, res, next) => {
  try {
    const investments = await Investment.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: investments.length,
      data: investments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all investments (admin)
// @route   GET /api/investments/all
// @access  Private/Admin
exports.getAllInvestments = async (req, res, next) => {
  try {
    const investments = await Investment.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: investments.length,
      data: investments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel investment
// @route   PUT /api/investments/cancel/:id
// @access  Private
exports.cancelInvestment = async (req, res, next) => {
  try {
    const investment = await Investment.findById(req.params.id);
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        error: 'Investment not found'
      });
    }
    
    // Check ownership
    if (investment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }
    
    // Check if investment can be cancelled
    if (investment.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Only active investments can be cancelled'
      });
    }
    
    // Calculate refund (50% of remaining amount)
    const daysActive = Math.floor((new Date() - investment.startDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = investment.planDetails.duration - daysActive;
    const refundAmount = (investment.amount * daysRemaining) / (investment.planDetails.duration * 2);
    
    // Update investment
    investment.status = 'cancelled';
    investment.isActive = false;
    await investment.save();
    
    // Refund to user's wallet
    const user = await User.findById(req.user.id);
    user.walletBalance += refundAmount;
    await user.save();
    
    // Record refund
    await ROIHistory.create({
      user: req.user.id,
      investment: investment._id,
      amount: refundAmount,
      type: 'deposit',
      description: 'Refund from cancelled investment'
    });
    
    res.status(200).json({
      success: true,
      data: {
        investment,
        refundAmount
      }
    });
  } catch (error) {
    next(error);
  }
};