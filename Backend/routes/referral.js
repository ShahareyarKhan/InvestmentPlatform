const express = require('express');
const router = express.Router();
const {
  getReferralTree,
  getReferralStats,
  getReferralLink
} = require('../controllers/referralController');
const { protect } = require('../middleware/auth');

router.get('/tree', protect, getReferralTree);
router.get('/stats', protect, getReferralStats);
router.get('/link', protect, getReferralLink);

module.exports = router;