const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/SupplierController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { handleValidationErrors } = require('../middleware/validate');

router.use(authenticate, authorize('owner'));

router.get('/', SupplierController.list);
router.get('/:id', SupplierController.getById);
router.post('/', SupplierController.validation, handleValidationErrors, SupplierController.create);
router.put('/:id', SupplierController.validation, handleValidationErrors, SupplierController.update);
router.delete('/:id', SupplierController.remove);

module.exports = router;
