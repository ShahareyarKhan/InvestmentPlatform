const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,  
  refreshToken
} = require('../controllers/authController');
const { protect, loginLimiter } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put("/updateprofile",  protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);
router.post('/refresh-token', refreshToken);

module.exports = router;