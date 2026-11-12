const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/PurchaseController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { handleValidationErrors } = require('../middleware/validate');

router.use(authenticate, authorize('owner'));

router.get('/', PurchaseController.list);
router.get('/:id', PurchaseController.getById);
router.post('/', PurchaseController.validation, handleValidationErrors, PurchaseController.create);

module.exports = router;
