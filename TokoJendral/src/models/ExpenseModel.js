const db = require('../config/database');

class ExpenseModel {
  static async create({ userId, expenseDate, category, amount, notes }) {
    const [id] = await db('expenses').insert({
      user_id: userId,
      expense_date: expenseDate,
      category,
      amount,
      notes
    });
    return id;
  }

  static async findAll({ startDate, endDate } = {}) {
    let query = db('expenses')
      .join('users', 'expenses.user_id', 'users.id')
      .select('expenses.*', 'users.name as created_by');

    if (startDate) query = query.where('expenses.expense_date', '>=', startDate.slice(0, 10));
    if (endDate) query = query.where('expenses.expense_date', '<=', endDate.slice(0, 10));

    return query.orderBy('expenses.expense_date', 'desc');
  }

  static async findById(id) {
    return db('expenses').where({ id }).first();
  }

  static async update(id, data) {
    return db('expenses').where({ id }).update(data);
  }

  static async delete(id) {
    return db('expenses').where({ id }).del();
  }

  static async getTotalByDateRange(startDate, endDate) {
    let query = db('expenses');
    if (startDate) query = query.where('expense_date', '>=', startDate.slice(0, 10));
    if (endDate) query = query.where('expense_date', '<=', endDate.slice(0, 10));
    const result = await query.sum('amount as total');
    return parseFloat(result[0]?.total) || 0;
  }
}

module.exports = ExpenseModel;
