const express = require('express');
const router = express.Router();

const { register, registerAdmin, login, adminLogin, getMe, updateMe, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/admin/register', registerAdmin);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('gambar'), updateMe);
router.post('/reset-password', resetPassword);

module.exports = router;