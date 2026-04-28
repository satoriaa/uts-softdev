const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');

router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, getUserById);
router.post('/', protect, adminOnly, createUser);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;

