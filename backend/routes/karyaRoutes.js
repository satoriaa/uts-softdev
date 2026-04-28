const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAll, getById, create, update, remove } = require('../controllers/karyaController');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', protect, upload.single('gambar'), create);
router.put('/:id', protect, upload.single('gambar'), update);
router.delete('/:id', protect, remove);

module.exports = router;

