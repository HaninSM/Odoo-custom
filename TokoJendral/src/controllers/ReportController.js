const ReportService = require('../services/ReportService');
const InventoryBatchModel = require('../models/InventoryBatchModel');

const ReportController = {
  async salesReport(req, res, next) {
    try {
      const report = await ReportService.getSalesReport(req.query);
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  },

  async detailedSalesReport(req, res, next) {
    try {
      const report = await ReportService.getDetailedSalesReport(req.query);
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  },

  async profitReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ success: false, message: 'startDate dan endDate wajib diisi.' });
      }
      const report = await ReportService.getProfitReport({ startDate, endDate });
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  },

  async salesByUser(req, res, next) {
    try {
      const report = await ReportService.getSalesByUser(req.query);
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  },

  async fifoReport(req, res, next) {
    try {
      const batches = await InventoryBatchModel.getAllBatchesReport();
      res.json({ success: true, data: batches });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ReportController;
