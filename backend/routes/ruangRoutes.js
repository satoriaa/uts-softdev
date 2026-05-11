const express = require('express');
const router = express.Router();
const { protect, authorizeAdmin } = require('../middleware/auth');
const { getAll, getById, create, update, remove } = require('../controllers/ruangController');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', protect, authorizeAdmin, create);
router.put('/:id', protect, authorizeAdmin, update);
router.delete('/:id', protect, authorizeAdmin, remove);

module.exports = router;

