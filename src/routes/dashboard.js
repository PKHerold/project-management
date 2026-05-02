const router = require('express').Router();
const { getStats } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getStats);

module.exports = router;
