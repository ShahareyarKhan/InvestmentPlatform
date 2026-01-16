const express = require('express');
const router = express.Router();
const {
  createInvestment,
  getUserInvestments,
  getAllInvestments,
  cancelInvestment
} = require('../controllers/investmentController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createInvestment);
router.get('/my-investments', protect, getUserInvestments);
router.get('/all', protect, admin, getAllInvestments);
router.put('/cancel/:id', protect, cancelInvestment);

module.exports = router;