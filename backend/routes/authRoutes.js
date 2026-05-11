const express = require('express');
const router = express.Router();

const { register, registerAdmin, login, adminLogin, getMe, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/admin/register', registerAdmin);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/me', protect, getMe);
router.post('/reset-password', resetPassword);

module.exports = router;