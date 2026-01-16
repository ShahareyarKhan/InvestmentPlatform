const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Investment amount is required'],
    min: [10, 'Minimum investment amount is $10']
  },
  plan: {
    type: String,
    enum: ['basic', 'premium', 'vip'],
    required: true
  },
  planDetails: {
    dailyROI: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    levelCommission: [{
      level: Number,
      percentage: Number
    }]
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  lastROICalculation: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate end date based on plan
investmentSchema.pre('save', function(next) {
  if (this.isNew) {
    const durationMap = {
      'basic': 30,
      'premium': 60,
      'vip': 90
    };
    
    const roiMap = {
      'basic': 0.02, // 2% daily
      'premium': 0.025, // 2.5% daily
      'vip': 0.03 // 3% daily
    };
    
    const commissionMap = {
      'basic': [{level: 1, percentage: 5}, {level: 2, percentage: 3}],
      'premium': [{level: 1, percentage: 7}, {level: 2, percentage: 4}, {level: 3, percentage: 2}],
      'vip': [{level: 1, percentage: 10}, {level: 2, percentage: 6}, {level: 3, percentage: 3}, {level: 4, percentage: 1}]
    };
    
    this.planDetails = {
      dailyROI: roiMap[this.plan],
      duration: durationMap[this.plan],
      levelCommission: commissionMap[this.plan]
    };
    
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate() + durationMap[this.plan]);
    this.endDate = endDate;
  }
  next();
});

const Investment = mongoose.model('Investment', investmentSchema);
module.exports = Investment;