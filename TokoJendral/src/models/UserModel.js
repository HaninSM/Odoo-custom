const db = require('../config/database');

class UserModel {
  static async findByEmail(email) {
    return db('users').where({ email }).first();
  }

  static async findById(id) {
    return db('users').where({ id }).first();
  }

  static async create({ name, email, passwordHash, role }) {
    const [id] = await db('users').insert({
      name,
      email,
      password_hash: passwordHash,
      role
    });
    return id;
  }

  static async findAll() {
    return db('users').select('id', 'name', 'email', 'role', 'is_active', 'created_at');
  }

  static async update(id, data) {
    return db('users').where({ id }).update({ ...data, updated_at: db.fn.now() });
  }

  static async deactivate(id) {
    return db('users').where({ id }).update({ is_active: false, updated_at: db.fn.now() });
  }
}

module.exports = UserModel;
