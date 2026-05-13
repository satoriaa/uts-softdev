const express = require('express');
const router = express.Router();
const multer = require('multer'); // 1. Import multer
const upload = multer(); // 2. Inisialisasi (default simpan di memory)
const { protect, authorizeAdmin } = require('../middleware/auth');
const { getAll, getById, create, update, remove } = require('../controllers/ruangController');

router.get('/', getAll);
router.get('/:id', getById);

// 3. Tambahkan upload.single('gambar') sebelum controller
router.post('/', protect, authorizeAdmin, upload.single('gambar'), create);
router.put('/:id', protect, authorizeAdmin, upload.single('gambar'), update);

router.delete('/:id', protect, authorizeAdmin, remove);

module.exports = router;