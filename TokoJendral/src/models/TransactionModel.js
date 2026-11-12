const db = require('../config/database');

class TransactionModel {
  static async create(trx, { userId, customerName, totalAmount, paymentMethod, paymentStatus, amountPaid, changeAmount, transactionDate }) {
    const nowIso = new Date().toISOString();
    const [id] = await (trx || db)('transactions').insert({
      user_id: userId,
      customer_name: customerName,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      amount_paid: amountPaid,
      change_amount: changeAmount,
      transaction_date: transactionDate || nowIso,
      created_at: transactionDate || nowIso
    });
    return id;
  }

  static async createItem(trx, { transactionId, batchId, productUnitId, quantitySold, baseQuantityDeducted, unitPrice, costPrice, subtotalPrice }) {
    const [id] = await (trx || db)('transaction_items').insert({
      transaction_id: transactionId,
      batch_id: batchId,
      product_unit_id: productUnitId,
      quantity_sold: quantitySold,
      base_quantity_deducted: baseQuantityDeducted,
      unit_price: unitPrice,
      cost_price: costPrice,
      subtotal_price: subtotalPrice
    });
    return id;
  }

  static async findAll({ userId, startDate, endDate, limit = 50, offset = 0 } = {}) {
    let query = db('transactions')
      .join('users', 'transactions.user_id', 'users.id')
      .select(
        'transactions.*',
        'users.name as cashier_name',
        'users.role as cashier_role'
      );

    if (userId) query = query.where('transactions.user_id', userId);
    if (startDate) {
      const start = startDate.length === 10 ? `${startDate} 00:00:00` : startDate.replace('T', ' ');
      query = query.whereRaw("datetime(transactions.transaction_date, 'localtime') >= ?", [start]);
    }
    if (endDate) {
      const end = endDate.length === 10 ? `${endDate} 23:59:59` : endDate.replace('T', ' ');
      query = query.whereRaw("datetime(transactions.transaction_date, 'localtime') <= ?", [end]);
    }

    return query.orderBy('transactions.transaction_date', 'desc').limit(limit).offset(offset);
  }

  static async findById(id) {
    const transaction = await db('transactions')
      .join('users', 'transactions.user_id', 'users.id')
      .select('transactions.*', 'users.name as cashier_name', 'users.role as cashier_role')
      .where('transactions.id', id)
      .first();

    if (!transaction) return null;

    const items = await db('transaction_items')
      .join('product_units', 'transaction_items.product_unit_id', 'product_units.id')
      .select(
        'transaction_items.*',
        'product_units.unit_name',
        'product_units.item_name'
      )
      .where('transaction_items.transaction_id', id);

    return { ...transaction, items };
  }

  static async updatePaymentStatus(id, status) {
    return db('transactions').where({ id }).update({ payment_status: status });
  }
}

module.exports = TransactionModel;
