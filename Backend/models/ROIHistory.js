const mongoose = require('mongoose');

const roiHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  investment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['roi', 'level_income', 'withdrawal', 'deposit'],
    required: true
  },
  description: {
    type: String
  },
  level: {
    type: Number,
    required: function() {
      return this.type === 'level_income';
    }
  },
  referredUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
roiHistorySchema.index({ user: 1, date: -1 });
roiHistorySchema.index({ investment: 1, date: -1 });

const ROIHistory = mongoose.model('ROIHistory', roiHistorySchema);
module.exports = ROIHistory;