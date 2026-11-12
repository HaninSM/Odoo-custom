const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { handleValidationErrors } = require('../middleware/validate');

// All authenticated users can view products (resellers see filtered)
router.get('/', authenticate, ProductController.list);
router.get('/grouped', authenticate, ProductController.listGrouped);
router.get('/item-base-cost', authenticate, ProductController.getItemBaseCost);
router.get('/stock', authenticate, ProductController.getStock);
router.get('/low-stock', authenticate, authorize('owner'), ProductController.checkLowStock);
// Repackage & Bundling routes (Owner only)
router.post('/repackage', authenticate, authorize('owner'), ProductController.repackage);
router.post('/repackage/reset', authenticate, authorize('owner'), ProductController.resetRepackage);
router.post('/bundle', authenticate, authorize('owner'), ProductController.createBundle);
router.get('/bundle/:id/recipe', authenticate, ProductController.getBundleRecipe);

router.get('/:id', authenticate, ProductController.getById);
router.get('/:id/hpp', authenticate, authorize('owner'), ProductController.getHpp);

// Only owner can manage products
router.post('/batch-setup', authenticate, authorize('owner'), ProductController.batchSetupValidation, handleValidationErrors, ProductController.batchSetup);
router.post('/', authenticate, authorize('owner'), ProductController.validation, handleValidationErrors, ProductController.create);
router.put('/:id', authenticate, authorize('owner'), ProductController.update);
router.put('/:id/price', authenticate, authorize('owner'), ProductController.updatePrice);
router.delete('/:id', authenticate, authorize('owner'), ProductController.remove);

module.exports = router;
