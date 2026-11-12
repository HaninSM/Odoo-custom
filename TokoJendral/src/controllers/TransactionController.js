const { body } = require('express-validator');
const TransactionService = require('../services/TransactionService');
const TransactionModel = require('../models/TransactionModel');

const TransactionController = {
  checkoutValidation: [
    body('items').isArray({ min: 1 }).withMessage('Minimal 1 item transaksi.'),
    body('items.*.productUnitId').isInt({ min: 1 }).withMessage('Product unit ID wajib diisi.'),
    body('items.*.quantity').isFloat({ gt: 0 }).withMessage('Jumlah harus lebih dari 0.'),
    body('paymentMethod').isIn(['CASH', 'TRANSFER', 'QRIS']).withMessage('Metode pembayaran tidak valid.'),
    body('transactionDate').optional({ checkFalsy: true }).isISO8601().withMessage('Format tanggal transaksi tidak valid.')
  ],

  async checkout(req, res, next) {
    try {
      const result = await TransactionService.checkout({
        userId: req.user.id,
        ...req.body
      });
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const filters = {};
      // Cashier & reseller can only see their own transactions
      if (req.user.role !== 'owner') {
        filters.userId = req.user.id;
      } else if (req.query.userId) {
        filters.userId = req.query.userId;
      }
      if (req.query.startDate) filters.startDate = req.query.startDate;
      if (req.query.endDate) filters.endDate = req.query.endDate;
      if (req.query.limit) filters.limit = parseInt(req.query.limit);
      if (req.query.offset) filters.offset = parseInt(req.query.offset);

      const transactions = await TransactionModel.findAll(filters);
      res.json({ success: true, data: transactions });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const transaction = await TransactionModel.findById(req.params.id);
      if (!transaction) return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });

      // Cashier & reseller can only see their own transactions
      if (req.user.role !== 'owner' && transaction.user_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Akses ditolak.' });
      }

      res.json({ success: true, data: transaction });
    } catch (err) {
      next(err);
    }
  },

  async confirmPayment(req, res, next) {
    try {
      const result = await TransactionService.confirmPayment(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = TransactionController;
