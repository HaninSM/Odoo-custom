const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/SettingsController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.use(authenticate, authorize('owner'));

router.get('/', SettingsController.getAll);
router.put('/', SettingsController.update);

module.exports = router;
