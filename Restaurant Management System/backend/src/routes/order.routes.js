const express = require('express');
const router = express.Router();
const { getAll, getById, create, updateStatus, remove } = require('../controllers/order.controller');
const { protect, authorize } = require('../middlewares/auth');
const { cache } = require('../middlewares/cache');

router.use(protect);

router.get('/', cache(30, 'cache'), getAll);
router.get('/:id', cache(30, 'cache'), getById);
router.post('/', create);
router.put('/:id/status', updateStatus);
router.delete('/:id', authorize('admin'), remove);

module.exports = router;
