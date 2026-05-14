const express = require('express');
const router = express.Router();
const { getAll, create, update, reserve, release } = require('../controllers/table.controller');
const { protect, authorize } = require('../middlewares/auth');
const { cache } = require('../middlewares/cache');

router.use(protect);

router.get('/', cache(60, 'cache'), getAll);
router.post('/', authorize('admin'), create);
router.put('/:id', authorize('admin'), update);
router.put('/:id/reserve', authorize('admin'), reserve);
router.put('/:id/release', authorize('admin'), release);

module.exports = router;
