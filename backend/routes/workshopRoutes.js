const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAll, getById, create, update, remove, daftar } = require('../controllers/workshopController');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', protect, adminOnly, upload.single('gambar'), create);
router.put('/:id', protect, adminOnly, upload.single('gambar'), update);
router.delete('/:id', protect, adminOnly, remove);
router.post('/:id/daftar', protect, daftar);

module.exports = router;

