const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth');
const { cache } = require('../middlewares/cache');

router.use(protect);

router.get('/stats', cache(15, 'cache'), getStats);

module.exports = router;
