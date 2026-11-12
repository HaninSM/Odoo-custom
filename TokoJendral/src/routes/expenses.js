const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/ExpenseController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { handleValidationErrors } = require('../middleware/validate');

router.use(authenticate, authorize('owner'));

router.get('/', ExpenseController.list);
router.post('/', ExpenseController.validation, handleValidationErrors, ExpenseController.create);
router.put('/:id', ExpenseController.validation, handleValidationErrors, ExpenseController.update);
router.delete('/:id', ExpenseController.remove);

module.exports = router;
