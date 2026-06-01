const express = require('express');
const router = express.Router();
const { protect, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');

router.get('/', protect, authorizeAdmin, getAllUsers);
router.get('/:id', protect, getUserById);
router.post('/', protect, authorizeAdmin, upload.single('gambar'), createUser);
router.put('/:id', protect, updateUser);

router.delete('/:id', protect, authorizeAdmin, deleteUser);

module.exports = router;


