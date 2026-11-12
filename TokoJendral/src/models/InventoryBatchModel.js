const db = require('../config/database');

class InventoryBatchModel {
  /**
   * Create a new inventory batch when goods are received.
   * All quantities must be in base units (e.g., meters).
   */
  static async create({ purchaseId, itemId, itemName, initialQuantity, baseCostPrice, receivedDate }) {
    const [id] = await db('inventory_batches').insert({
      purchase_id: purchaseId,
      item_id: itemId || null,
      item_name: itemName,
      initial_quantity: initialQuantity,
      remaining_quantity: initialQuantity,
      base_cost_price: baseCostPrice,
      received_date: receivedDate
    });
    return id;
  }

  /**
   * Get all active batches for an item, ordered by FIFO (oldest first).
   * Only returns batches with remaining stock > 0.
   */
  static async getActiveBatchesByItem(itemNameOrId) {
    let query = db('inventory_batches').where('remaining_quantity', '>', 0);
    if (typeof itemNameOrId === 'number') {
      query = query.where(function() {
        this.where('item_id', itemNameOrId).orWhere('item_name', String(itemNameOrId));
      });
    } else {
      query = query.where('item_name', itemNameOrId);
    }
    return query.orderBy('received_date', 'asc').orderBy('id', 'asc');
  }

  /**
   * Get total remaining stock for an item across all batches.
   */
  static async getTotalStock(itemNameOrId) {
    let query = db('inventory_batches').where('remaining_quantity', '>', 0);
    if (typeof itemNameOrId === 'number') {
      query = query.where(function() {
        this.where('item_id', itemNameOrId).orWhere('item_name', String(itemNameOrId));
      });
    } else {
      query = query.where('item_name', itemNameOrId);
    }
    const result = await query.sum('remaining_quantity as total');
    return parseFloat(result[0]?.total) || 0;
  }

  /**
   * Deduct stock from a specific batch (used during FIFO deduction).
   */
  static async deductStock(batchId, quantity) {
    return db('inventory_batches')
      .where({ id: batchId })
      .decrement('remaining_quantity', quantity);
  }

  /**
   * Get all batches grouped by item for stock report.
   */
  static async getAllBatchesReport() {
    return db('inventory_batches')
      .leftJoin('purchases', 'inventory_batches.purchase_id', 'purchases.id')
      .leftJoin('suppliers', 'purchases.supplier_id', 'suppliers.id')
      .leftJoin('items', 'inventory_batches.item_id', 'items.id')
      .select(
        'inventory_batches.*',
        'suppliers.name as supplier_name',
        'items.base_unit as master_base_unit'
      )
      .orderBy('inventory_batches.item_name')
      .orderBy('inventory_batches.received_date', 'asc');
  }

  /**
   * Get distinct item names that have active batches.
   */
  static async getDistinctItems() {
    return db('inventory_batches')
      .distinct('item_name')
      .where('remaining_quantity', '>', 0)
      .orderBy('item_name');
  }

  /**
   * Get batches that are below low-stock threshold.
   * Returns batches where remaining/initial ratio < threshold percentage.
   */
  static async getLowStockBatches(thresholdPercent) {
    const threshold = thresholdPercent / 100;
    return db('inventory_batches')
      .where('remaining_quantity', '>', 0)
      .whereRaw('CAST(remaining_quantity AS REAL) / CAST(initial_quantity AS REAL) < ?', [threshold])
      .orderBy('item_name');
  }
}

module.exports = InventoryBatchModel;
