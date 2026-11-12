const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { handleValidationErrors } = require('../middleware/validate');

// Authenticated routes
router.get('/', authenticate, ItemController.list);
router.get('/overview', authenticate, ItemController.overview);
router.get('/:id', authenticate, ItemController.getById);

// Owner-only
router.post('/', authenticate, authorize('owner'), ItemController.validation, handleValidationErrors, ItemController.create);
router.put('/:id', authenticate, authorize('owner'), ItemController.update);

module.exports = router;
