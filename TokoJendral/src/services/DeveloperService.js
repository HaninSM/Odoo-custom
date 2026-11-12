const db = require('../config/database');

class DeveloperService {
  /**
   * Get table row counts and date ranges for preview.
   */
  static async getStats() {
    const [txCount] = await db('transactions').count('id as count');
    const [txDates] = await db('transactions').min('transaction_date as minDate').max('transaction_date as maxDate');

    const [purchaseCount] = await db('purchases').count('id as count');
    const [purchaseDates] = await db('purchases').min('purchase_date as minDate').max('purchase_date as maxDate');

    const [expenseCount] = await db('expenses').count('id as count');
    const [expenseDates] = await db('expenses').min('expense_date as minDate').max('expense_date as maxDate');

    const [unitCount] = await db('product_units').count('id as count');
    const [itemCount] = await db('items').count('id as count');
    const [supplierCount] = await db('suppliers').count('id as count');
    const [batchCount] = await db('inventory_batches').count('id as count');

    return {
      transactions: { count: Number(txCount.count), minDate: txDates.minDate, maxDate: txDates.maxDate },
      purchases: { count: Number(purchaseCount.count), minDate: purchaseDates.minDate, maxDate: purchaseDates.maxDate },
      expenses: { count: Number(expenseCount.count), minDate: expenseDates.minDate, maxDate: expenseDates.maxDate },
      productUnits: { count: Number(unitCount.count) },
      items: { count: Number(itemCount.count) },
      suppliers: { count: Number(supplierCount.count) },
      inventoryBatches: { count: Number(batchCount.count) }
    };
  }

  /**
   * Delete data based on mode ('all' or 'filtered' with forms and date range).
   *
   * @param {Object} params
   * @param {string} params.mode - 'all' | 'filtered'
   * @param {Array<string>} params.forms - ['transactions', 'purchases', 'expenses', 'products', 'items', 'suppliers']
   * @param {string} params.startDate - YYYY-MM-DD
   * @param {string} params.endDate - YYYY-MM-DD
   */
  static async cleanupData({ mode, forms = [], startDate, endDate }) {
    return db.transaction(async (trx) => {
      const deletedCounts = {
        transactions: 0,
        transactionItems: 0,
        inventoryBatches: 0,
        purchases: 0,
        expenses: 0,
        productUnits: 0,
        items: 0,
        suppliers: 0
      };

      if (mode === 'all') {
        // Delete all business and transaction data in safe reverse dependency order
        deletedCounts.transactionItems = await trx('transaction_items').del();
        deletedCounts.transactions = await trx('transactions').del();
        deletedCounts.inventoryBatches = await trx('inventory_batches').del();
        deletedCounts.purchases = await trx('purchases').del();
        deletedCounts.productUnits = await trx('product_units').del();
        deletedCounts.items = await trx('items').del();
        deletedCounts.suppliers = await trx('suppliers').del();
        deletedCounts.expenses = await trx('expenses').del();

        return {
          mode: 'all',
          message: 'Semua data operasional & master berhasil dihapus.',
          deleted: deletedCounts
        };
      }

      // Filtered deletion
      const startDateTime = startDate ? `${startDate} 00:00:00` : null;
      const endDateTime = endDate ? `${endDate} 23:59:59` : null;

      // 1. Transactions
      if (forms.includes('transactions')) {
        let q = trx('transactions');
        if (startDateTime) q = q.whereRaw("datetime(transaction_date, 'localtime') >= ?", [startDateTime]);
        if (endDateTime) q = q.whereRaw("datetime(transaction_date, 'localtime') <= ?", [endDateTime]);
        const txRows = await q.select('id');
        const txIds = txRows.map((r) => r.id);

        if (txIds.length > 0) {
          deletedCounts.transactionItems += await trx('transaction_items').whereIn('transaction_id', txIds).del();
          deletedCounts.transactions += await trx('transactions').whereIn('id', txIds).del();
        }
      }

      // 2. Expenses
      if (forms.includes('expenses')) {
        let q = trx('expenses');
        if (startDate) q = q.where('expense_date', '>=', startDate.slice(0, 10));
        if (endDate) q = q.where('expense_date', '<=', endDate.slice(0, 10));
        deletedCounts.expenses += await q.del();
      }

      // 3. Purchases & Inventory Batches
      if (forms.includes('purchases')) {
        let q = trx('purchases');
        if (startDate) q = q.where('purchase_date', '>=', startDate.slice(0, 10));
        if (endDate) q = q.where('purchase_date', '<=', endDate.slice(0, 10));
        const pRows = await q.select('id');
        const pIds = pRows.map((r) => r.id);

        if (pIds.length > 0) {
          const batches = await trx('inventory_batches').whereIn('purchase_id', pIds).select('id');
          const bIds = batches.map((b) => b.id);
          if (bIds.length > 0) {
            deletedCounts.transactionItems += await trx('transaction_items').whereIn('batch_id', bIds).del();
            deletedCounts.inventoryBatches += await trx('inventory_batches').whereIn('id', bIds).del();
          }
          deletedCounts.purchases += await trx('purchases').whereIn('id', pIds).del();
        }
      }

      // 4. Products (Product Units)
      if (forms.includes('products')) {
        let q = trx('product_units');
        if (startDateTime) q = q.whereRaw("datetime(created_at, 'localtime') >= ?", [startDateTime]);
        if (endDateTime) q = q.whereRaw("datetime(created_at, 'localtime') <= ?", [endDateTime]);
        const uRows = await q.select('id');
        const uIds = uRows.map((u) => u.id);

        if (uIds.length > 0) {
          deletedCounts.transactionItems += await trx('transaction_items').whereIn('product_unit_id', uIds).del();
          deletedCounts.productUnits += await trx('product_units').whereIn('id', uIds).del();
        }
      }

      // 5. Items (Master Barang)
      if (forms.includes('items')) {
        let q = trx('items');
        if (startDateTime) q = q.whereRaw("datetime(created_at, 'localtime') >= ?", [startDateTime]);
        if (endDateTime) q = q.whereRaw("datetime(created_at, 'localtime') <= ?", [endDateTime]);
        const itemRows = await q.select('id');
        const itemIds = itemRows.map((i) => i.id);

        if (itemIds.length > 0) {
          const units = await trx('product_units').whereIn('item_id', itemIds).select('id');
          const uIds = units.map((u) => u.id);
          if (uIds.length > 0) {
            deletedCounts.transactionItems += await trx('transaction_items').whereIn('product_unit_id', uIds).del();
            deletedCounts.productUnits += await trx('product_units').whereIn('id', uIds).del();
          }

          const batches = await trx('inventory_batches').whereIn('item_id', itemIds).select('id');
          const bIds = batches.map((b) => b.id);
          if (bIds.length > 0) {
            deletedCounts.transactionItems += await trx('transaction_items').whereIn('batch_id', bIds).del();
            deletedCounts.inventoryBatches += await trx('inventory_batches').whereIn('id', bIds).del();
          }

          deletedCounts.items += await trx('items').whereIn('id', itemIds).del();
        }
      }

      // 6. Suppliers
      if (forms.includes('suppliers')) {
        let q = trx('suppliers');
        if (startDateTime) q = q.whereRaw("datetime(created_at, 'localtime') >= ?", [startDateTime]);
        if (endDateTime) q = q.whereRaw("datetime(created_at, 'localtime') <= ?", [endDateTime]);
        const sRows = await q.select('id');
        const sIds = sRows.map((s) => s.id);

        if (sIds.length > 0) {
          const pRows = await trx('purchases').whereIn('supplier_id', sIds).select('id');
          const pIds = pRows.map((p) => p.id);
          if (pIds.length > 0) {
            const batches = await trx('inventory_batches').whereIn('purchase_id', pIds).select('id');
            const bIds = batches.map((b) => b.id);
            if (bIds.length > 0) {
              deletedCounts.transactionItems += await trx('transaction_items').whereIn('batch_id', bIds).del();
              deletedCounts.inventoryBatches += await trx('inventory_batches').whereIn('id', bIds).del();
            }
            deletedCounts.purchases += await trx('purchases').whereIn('id', pIds).del();
          }
          deletedCounts.suppliers += await trx('suppliers').whereIn('id', sIds).del();
        }
      }

      return {
        mode: 'filtered',
        message: 'Data terpilih pada periode yang ditentukan berhasil dihapus.',
        deleted: deletedCounts
      };
    });
  }
}

module.exports = DeveloperService;
