const { body } = require('express-validator');
const SettingsModel = require('../models/SettingsModel');

const SettingsController = {
  async getAll(req, res, next) {
    try {
      const settings = await SettingsModel.getAll();
      res.json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { key, value } = req.body;
      if (!key || value === undefined) {
        return res.status(400).json({ success: false, message: 'Key dan value wajib diisi.' });
      }
      await SettingsModel.set(key, String(value));
      res.json({ success: true, message: `Setting '${key}' berhasil diupdate.` });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = SettingsController;
