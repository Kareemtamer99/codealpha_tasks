const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/inventory.controller');
const { protect, authorize } = require('../middlewares/auth');
const { cache } = require('../middlewares/cache');

router.use(protect);

router.get('/', cache(60, 'cache'), getAll);
router.post('/', authorize('admin'), create);
router.put('/:id', authorize('admin'), update);
router.delete('/:id', authorize('admin'), remove);

module.exports = router;
