const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  getROIHistory,
  getEarningsSummary
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/data', protect, getDashboardData);
router.get('/roi-history', protect, getROIHistory);
router.get('/earnings-summary', protect, getEarningsSummary);

module.exports = router;