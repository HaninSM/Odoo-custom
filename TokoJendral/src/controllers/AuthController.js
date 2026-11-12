const { body } = require('express-validator');
const AuthService = require('../services/AuthService');
const UserModel = require('../models/UserModel');

const AuthController = {
  loginValidation: [
    body('email').isEmail().withMessage('Email tidak valid.'),
    body('password').notEmpty().withMessage('Password wajib diisi.')
  ],

  registerValidation: [
    body('name').trim().notEmpty().withMessage('Nama wajib diisi.'),
    body('email').isEmail().withMessage('Email tidak valid.'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter.'),
    body('role').isIn(['owner', 'cashier', 'reseller', 'developer']).withMessage('Role tidak valid.')
  ],

  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getProfile(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
      const { password_hash, ...safeUser } = user;
      res.json({ success: true, data: safeUser });
    } catch (err) {
      next(err);
    }
  },

  async listUsers(req, res, next) {
    try {
      const users = await UserModel.findAll();
      res.json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AuthController;
