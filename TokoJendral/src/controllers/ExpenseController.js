const { body } = require('express-validator');
const ExpenseModel = require('../models/ExpenseModel');

const ExpenseController = {
  validation: [
    body('expenseDate').isISO8601().withMessage('Tanggal pengeluaran tidak valid.'),
    body('category').trim().notEmpty().withMessage('Kategori wajib diisi.'),
    body('amount').isFloat({ gt: 0 }).withMessage('Jumlah harus lebih dari 0.')
  ],

  async list(req, res, next) {
    try {
      const expenses = await ExpenseModel.findAll(req.query);
      res.json({ success: true, data: expenses });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const id = await ExpenseModel.create({ ...req.body, userId: req.user.id });
      res.status(201).json({ success: true, data: { id, ...req.body } });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      await ExpenseModel.update(req.params.id, req.body);
      res.json({ success: true, message: 'Pengeluaran berhasil diupdate.' });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await ExpenseModel.delete(req.params.id);
      res.json({ success: true, message: 'Pengeluaran berhasil dihapus.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ExpenseController;
