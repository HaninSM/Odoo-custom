const { body } = require('express-validator');
const SupplierModel = require('../models/SupplierModel');

const SupplierController = {
  validation: [
    body('name').trim().notEmpty().withMessage('Nama supplier wajib diisi.')
  ],

  async list(req, res, next) {
    try {
      const suppliers = await SupplierModel.findAll();
      res.json({ success: true, data: suppliers });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const supplier = await SupplierModel.findById(req.params.id);
      if (!supplier) return res.status(404).json({ success: false, message: 'Supplier tidak ditemukan.' });
      res.json({ success: true, data: supplier });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const id = await SupplierModel.create(req.body);
      res.status(201).json({ success: true, data: { id, ...req.body } });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      await SupplierModel.update(req.params.id, req.body);
      res.json({ success: true, message: 'Supplier berhasil diupdate.' });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await SupplierModel.deactivate(req.params.id);
      res.json({ success: true, message: 'Supplier berhasil dihapus.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = SupplierController;
