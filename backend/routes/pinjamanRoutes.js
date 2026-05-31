const express = require('express');
const router = express.Router();
const { protect, authorizeAdmin } = require('../middleware/auth');
const { getAll, getById, create, update, remove, finish, getByRuang } = require('../controllers/pinjamanController');
const { acknowledge } = require('../controllers/pinjamanController');

router.get('/', protect, getAll);
router.get('/ruang/:ruangId', protect, getByRuang);
router.get('/:id', protect, getById);
router.post('/', protect, create);
router.put('/:id', protect, authorizeAdmin, update);
router.put('/:id/ack', protect, acknowledge);
router.put('/:id/finish', protect, finish);
router.delete('/:id', protect, authorizeAdmin, remove);

module.exports = router;