const db = require('../config/database');

class PurchaseModel {
  static async create({ supplierId, userId, purchaseDate, totalCost, notes }) {
    const [id] = await db('purchases').insert({
      supplier_id: supplierId,
      user_id: userId,
      purchase_date: purchaseDate,
      total_cost: totalCost,
      notes
    });
    return id;
  }

  static async findAll() {
    return db('purchases')
      .join('suppliers', 'purchases.supplier_id', 'suppliers.id')
      .join('users', 'purchases.user_id', 'users.id')
      .select(
        'purchases.*',
        'suppliers.name as supplier_name',
        'users.name as created_by'
      )
      .orderBy('purchases.purchase_date', 'desc');
  }

  static async findById(id) {
    return db('purchases')
      .join('suppliers', 'purchases.supplier_id', 'suppliers.id')
      .select('purchases.*', 'suppliers.name as supplier_name')
      .where('purchases.id', id)
      .first();
  }
}

module.exports = PurchaseModel;
