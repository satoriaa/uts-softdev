const express = require('express');
const router = express.Router();
const { protect, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAll, getById, create, update, remove, daftar } = require('../controllers/lombaController');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', protect, authorizeAdmin, upload.single('gambar'), create);
router.put('/:id', protect, authorizeAdmin, upload.single('gambar'), update);
router.delete('/:id', protect, authorizeAdmin, remove);
router.post('/:id/daftar', protect, daftar);

module.exports = router;

