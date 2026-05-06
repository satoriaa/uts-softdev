const express = require('express');
const router = express.Router();

// 🔥 PERBAIKAN: Tambahkan resetPassword ke dalam kurung kurawal di bawah ini
const { register, login, getMe, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Tambahkan endpoint untuk reset-password
router.post('/reset-password', resetPassword);

module.exports = router;