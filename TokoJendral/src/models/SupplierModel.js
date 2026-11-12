const db = require('../config/database');

class SupplierModel {
  static async findAll() {
    return db('suppliers').where({ is_active: true }).orderBy('name');
  }

  static async findById(id) {
    return db('suppliers').where({ id }).first();
  }

  static async create({ name, phone, address }) {
    const [id] = await db('suppliers').insert({ name, phone, address });
    return id;
  }

  static async update(id, data) {
    return db('suppliers').where({ id }).update({ ...data, updated_at: db.fn.now() });
  }

  static async deactivate(id) {
    return db('suppliers').where({ id }).update({ is_active: false, updated_at: db.fn.now() });
  }
}

module.exports = SupplierModel;
