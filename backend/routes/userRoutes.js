const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');

router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, getUserById);
router.post('/', protect, adminOnly, upload.single('gambar'), createUser);
router.put('/:id', protect, adminOnly, upload.single('gambar'), updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;


