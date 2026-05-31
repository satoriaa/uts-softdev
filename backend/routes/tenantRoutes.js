const express = require('express');
const router = express.Router();
const { protect, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAll, getById, getByProker, create, update, remove } = require('../controllers/tenantController');


router.get('/', getAll);
router.get('/by-proker', getByProker);
router.get('/:id', getById);



router.post('/', protect, authorizeAdmin, upload.single('gambar'), create);
router.put('/:id', protect, authorizeAdmin, upload.single('gambar'), update);
router.delete('/:id', protect, authorizeAdmin, remove);

module.exports = router;