const db = require('../config/database');

class SettingsModel {
  static async get(key) {
    const row = await db('system_settings').where({ key }).first();
    return row ? row.value : null;
  }

  static async set(key, value) {
    const exists = await db('system_settings').where({ key }).first();
    if (exists) {
      return db('system_settings').where({ key }).update({ value, updated_at: db.fn.now() });
    }
    return db('system_settings').insert({ key, value });
  }

  static async getAll() {
    const rows = await db('system_settings').select('*');
    const settings = {};
    rows.forEach(row => { settings[row.key] = row.value; });
    return settings;
  }
}

module.exports = SettingsModel;
