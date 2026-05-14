const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/menu.controller');
const { protect, authorize } = require('../middlewares/auth');
const { cache } = require('../middlewares/cache');

router.get('/', cache(120, 'cache'), getAll);
router.get('/:id', cache(120, 'cache'), getById);
router.post('/', protect, authorize('admin'), create);
router.put('/:id', protect, authorize('admin'), update);
router.delete('/:id', protect, authorize('admin'), remove);

module.exports = router;
