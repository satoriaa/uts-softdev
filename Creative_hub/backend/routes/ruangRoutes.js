const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorizeAdmin } = require('../middleware/auth');
const { getAll, getById, create, update, remove } = require('../controllers/ruangController');
const { storage } = require('../config/cloudinary');

// Upload gambar langsung ke Cloudinary (bukan simpan lokal)
const upload = multer({ storage });

router.get('/', getAll);
router.get('/:id', getById);

router.post('/', protect, authorizeAdmin, upload.single('gambar'), create);
router.put('/:id', protect, authorizeAdmin, upload.single('gambar'), update);

router.delete('/:id', protect, authorizeAdmin, remove);

module.exports = router;