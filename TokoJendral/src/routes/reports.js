const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All report endpoints are owner-only
router.use(authenticate, authorize('owner'));

router.get('/sales', ReportController.salesReport);
router.get('/sales/detail', ReportController.detailedSalesReport);
router.get('/sales/by-user', ReportController.salesByUser);
router.get('/profit', ReportController.profitReport);
router.get('/fifo', ReportController.fifoReport);

module.exports = router;
