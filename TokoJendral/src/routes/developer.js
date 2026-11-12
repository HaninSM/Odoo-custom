const express = require('express');
const router = express.Router();
const DeveloperController = require('../controllers/DeveloperController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// Strictly authorized for 'developer' role only
router.use(authenticate, authorize('developer'));

router.get('/stats', DeveloperController.getStats);
router.post('/cleanup', DeveloperController.cleanup);

module.exports = router;
