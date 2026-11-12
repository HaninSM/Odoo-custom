const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { handleValidationErrors } = require('../middleware/validate');

router.use(authenticate);

// All authenticated users can checkout and view their transactions
router.post('/checkout', TransactionController.checkoutValidation, handleValidationErrors, TransactionController.checkout);
router.get('/', TransactionController.list);
router.get('/:id', TransactionController.getById);

// Only owner can confirm payments
router.put('/:id/confirm', authorize('owner'), TransactionController.confirmPayment);

module.exports = router;
