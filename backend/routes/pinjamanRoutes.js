const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAll, getById, create, update, remove } = require('../controllers/pinjamanController');

router.get('/', protect, getAll);
router.get('/:id', protect, getById);
router.post('/', protect, create);
router.put('/:id', protect, adminOnly, update);
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;

