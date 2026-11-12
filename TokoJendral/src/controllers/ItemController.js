const { body } = require('express-validator');
const ItemModel = require('../models/ItemModel');
const PricingService = require('../services/PricingService');

const ItemController = {
  validation: [
    body('name').trim().notEmpty().withMessage('Nama barang wajib diisi.'),
    body('baseUnit').trim().notEmpty().withMessage('Satuan dasar wajib diisi.')
  ],

  async list(req, res, next) {
    try {
      const items = await ItemModel.findAll();
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  },

  async overview(req, res, next) {
    try {
      const overview = await ItemModel.getItemsWithUnitsAndStock();
      res.json({ success: true, data: overview });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const item = await ItemModel.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Barang tidak ditemukan.' });
      }

      const costInfo = await PricingService.calculateItemBaseCost(item.name);
      res.json({
        success: true,
        data: {
          ...item,
          avgBaseHpp: costInfo.avgBaseCost,
          totalBaseStock: costInfo.totalRemainingStock
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const existing = await ItemModel.findByName(req.body.name);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Barang dengan nama ini sudah ada.' });
      }

      const id = await ItemModel.create(req.body);
      const item = await ItemModel.findById(id);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      await ItemModel.update(req.params.id, req.body);
      res.json({ success: true, message: 'Data barang berhasil diupdate.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ItemController;
