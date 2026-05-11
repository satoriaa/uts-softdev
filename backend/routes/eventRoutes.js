const express = require('express');
const router = express.Router();
const { protect, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAll, getById, create, update, remove, getSpeakers } = require('../controllers/eventController');

router.get('/', getAll);
router.get('/speakers/list', getSpeakers); // Must be before /:id route
router.get('/:id', getById);
router.post('/', protect, authorizeAdmin, upload.single('gambar'), create);
router.put('/:id', protect, authorizeAdmin, upload.single('gambar'), update);
router.delete('/:id', protect, authorizeAdmin, remove);

module.exports = router;

