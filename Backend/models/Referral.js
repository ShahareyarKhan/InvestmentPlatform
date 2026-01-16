const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  referredUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  investmentAmount: {
    type: Number,
    default: 0
  },
  commissionEarned: {
    type: Number,
    default: 0
  },
  lastCommissionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Compound index
referralSchema.index({ referrer: 1, level: 1 });
referralSchema.index({ referredUser: 1, referrer: 1 }, { unique: true });

const Referral = mongoose.model('Referral', referralSchema);
module.exports = Referral;