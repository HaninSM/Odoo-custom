const { body } = require('express-validator');
const InventoryService = require('../services/InventoryService');
const PurchaseModel = require('../models/PurchaseModel');

const PurchaseController = {
  validation: [
    body('supplierId').isInt({ min: 1 }).withMessage('Supplier ID wajib diisi.'),
    body('purchaseDate').isISO8601().withMessage('Tanggal pembelian tidak valid.'),
    body('items').isArray({ min: 1 }).withMessage('Minimal 1 item pembelian.'),
    body('items.*.itemName').trim().notEmpty().withMessage('Nama item wajib diisi.'),
    body('items.*.quantity').isFloat({ gt: 0 }).withMessage('Jumlah harus lebih dari 0.'),
    body('items.*.costPerUnit').isFloat({ gt: 0 }).withMessage('Harga per unit harus lebih dari 0.'),
    body('items.*.baseUnitConversion').isFloat({ gt: 0 }).withMessage('Faktor konversi harus lebih dari 0.')
  ],

  async create(req, res, next) {
    try {
      const result = await InventoryService.recordPurchase({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const purchases = await PurchaseModel.findAll();
      res.json({ success: true, data: purchases });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const purchase = await PurchaseModel.findById(req.params.id);
      if (!purchase) return res.status(404).json({ success: false, message: 'Pembelian tidak ditemukan.' });
      res.json({ success: true, data: purchase });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = PurchaseController;
