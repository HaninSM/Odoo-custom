const db = require('../config/database');
const InventoryBatchModel = require('../models/InventoryBatchModel');
const ProductUnitModel = require('../models/ProductUnitModel');
const SettingsModel = require('../models/SettingsModel');
const AlertService = require('./AlertService');
const PricingService = require('./PricingService');

class InventoryService {
  /**
   * Record a new purchase and create inventory batches.
   * Each batch item is converted to base units (e.g., meters).
   *
   * @param {Object} purchaseData - { supplierId, userId, purchaseDate, notes, items[] }
   * @param {Array} purchaseData.items - [{ itemName, quantity, costPerUnit, baseUnitConversion, receivedDate }]
   *   - quantity: number of bulk units purchased (e.g., 10 rolls)
   *   - costPerUnit: cost per bulk unit (e.g., 500000 per roll)
   *   - baseUnitConversion: how many base units per bulk unit (e.g., 50 meters per roll)
   */
  static async recordPurchase({ supplierId, userId, purchaseDate, notes, items }) {
    return db.transaction(async (trx) => {
      // Calculate total cost
      const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0);

      // Create purchase record
      const [purchaseId] = await trx('purchases').insert({
        supplier_id: supplierId,
        user_id: userId,
        purchase_date: purchaseDate,
        total_cost: totalCost,
        notes
      });

      // Create inventory batches for each item
      const batches = [];
      const autoUpdatedPrices = [];

      for (const item of items) {
        const baseQuantity = item.quantity * item.baseUnitConversion;
        const baseCostPrice = item.costPerUnit / item.baseUnitConversion;

        // Resolve or create master item
        let itemId = item.itemId;
        if (!itemId && item.itemName) {
          const masterItem = await trx('items')
            .whereRaw('LOWER(name) = ?', [item.itemName.trim().toLowerCase()])
            .first();
          if (!masterItem) {
            const [newId] = await trx('items').insert({
              name: item.itemName.trim(),
              base_unit: item.baseUnit || 'Meter'
            });
            itemId = newId;
          } else {
            itemId = masterItem.id;
          }
        }

        const [batchId] = await trx('inventory_batches').insert({
          purchase_id: purchaseId,
          item_id: itemId || null,
          item_name: item.itemName.trim(),
          initial_quantity: baseQuantity,
          remaining_quantity: baseQuantity,
          base_cost_price: baseCostPrice,
          received_date: item.receivedDate || purchaseDate
        });

        batches.push({ id: batchId, itemId, itemName: item.itemName.trim(), baseQuantity, baseCostPrice });

        // Auto-update selling prices for units configured with percentage_margin
        const updated = await PricingService.syncItemMarginPrices(trx, itemId || item.itemName.trim());
        if (updated && updated.length > 0) {
          autoUpdatedPrices.push(...updated);
        }
      }

      return { purchaseId, totalCost, batches, autoUpdatedPrices };
    });
  }

  /**
   * Calculate available stock for a product unit, considering FIFO batches, allocated quota, or composite bundling.
   */
  static async getAvailableStock(productUnitId) {
    const productUnit = await ProductUnitModel.findById(productUnitId);
    if (!productUnit) throw Object.assign(new Error('Product unit tidak ditemukan.'), { status: 404 });

    // 1. Composite Bundling (Hampers / Paket Campuran) - Model B On-Demand Bottleneck
    if (productUnit.is_bundle) {
      const components = await db('bundle_items').where({ bundle_unit_id: productUnit.id });
      if (components.length === 0) {
        return {
          productUnit,
          totalBaseUnits: 0,
          availableUnits: 0,
          unitName: productUnit.unit_name,
          isBundle: true,
          components: []
        };
      }

      let minPossible = Infinity;
      const componentStockDetails = [];

      for (const comp of components) {
        const compStock = await InventoryBatchModel.getTotalStock(comp.component_item_name);
        const needed = parseFloat(comp.quantity_needed);
        const possible = needed > 0 ? Math.floor(compStock / needed) : 0;
        if (possible < minPossible) {
          minPossible = possible;
        }
        componentStockDetails.push({
          componentId: comp.component_item_id,
          componentName: comp.component_item_name,
          quantityNeeded: needed,
          stockAvailable: compStock,
          possibleBundles: possible
        });
      }

      const availableUnits = minPossible === Infinity ? 0 : minPossible;
      return {
        productUnit,
        totalBaseUnits: availableUnits,
        availableUnits,
        unitName: productUnit.unit_name,
        isBundle: true,
        components: componentStockDetails
      };
    }

    // 2. Physical Allocation (Repackage) - Fixed Quota
    if (productUnit.stock_mode === 'allocated') {
      const totalBaseUnits = await InventoryBatchModel.getTotalStock(productUnit.item_name);
      const allocatedUnits = parseFloat(productUnit.allocated_stock) || 0;
      return {
        productUnit,
        totalBaseUnits,
        availableUnits: allocatedUnits,
        unitName: productUnit.unit_name,
        stockMode: 'allocated'
      };
    }

    // 3. Floating Pool (Default) - Maximum On-Demand Convertible
    const totalBaseUnits = await InventoryBatchModel.getTotalStock(productUnit.item_name);
    const availableUnits = Math.floor(totalBaseUnits / productUnit.conversion_factor * 10000) / 10000;

    return {
      productUnit,
      totalBaseUnits,
      availableUnits,
      unitName: productUnit.unit_name,
      stockMode: 'floating'
    };
  }

  /**
   * FIFO stock deduction: deducts base units from the oldest batches first.
   * Returns array of { batchId, quantityDeducted, costPrice } for cost tracking.
   *
   * This is the core FIFO algorithm:
   * 1. Fetch all active batches for the item, ordered by received_date ASC
   * 2. Iterate through batches, deducting from oldest first
   * 3. If a batch doesn't have enough, take what's available and move to next
   * 4. Track cost per batch for accurate HPP calculation
   */
  static async deductStockFifo(trx, itemName, baseUnitsNeeded) {
    const batches = await trx('inventory_batches')
      .where({ item_name: itemName })
      .where('remaining_quantity', '>', 0)
      .orderBy('received_date', 'asc')
      .orderBy('id', 'asc');

    let remaining = baseUnitsNeeded;
    const deductions = [];

    for (const batch of batches) {
      if (remaining <= 0) break;

      const available = parseFloat(batch.remaining_quantity);
      const deduct = Math.min(available, remaining);

      await trx('inventory_batches')
        .where({ id: batch.id })
        .update({ remaining_quantity: available - deduct });

      deductions.push({
        batchId: batch.id,
        quantityDeducted: deduct,
        costPrice: parseFloat(batch.base_cost_price)
      });

      remaining -= deduct;
    }

    if (remaining > 0.0001) {
      throw Object.assign(
        new Error(`Stok tidak mencukupi untuk ${itemName}. Kurang ${remaining.toFixed(4)} unit dasar.`),
        { status: 400 }
      );
    }

    return deductions;
  }

  /**
   * Check for low stock items and trigger alerts.
   * Compares remaining/initial ratio against global threshold.
   */
  static async checkLowStock() {
    const threshold = await SettingsModel.get('low_stock_threshold_percentage');
    const thresholdValue = parseFloat(threshold) || 20;
    const lowStockBatches = await InventoryBatchModel.getLowStockBatches(thresholdValue);

    if (lowStockBatches.length > 0) {
      await AlertService.sendLowStockAlert(lowStockBatches, thresholdValue);
    }

    return lowStockBatches;
  }

  /**
   * Get full stock summary: for each item, total stock in base units
   * plus all available product units and their stock.
   */
  static async getStockSummary() {
    const items = await db('items').select('*').orderBy('name', 'asc');
    const summary = [];

    for (const item of items) {
      const batches = await InventoryBatchModel.getActiveBatchesByItem(item.name);
      let totalBase = 0;
      batches.forEach(b => {
        totalBase += parseFloat(b.remaining_quantity);
      });

      const productUnits = await ProductUnitModel.findByItem(item.name);
      const unitStocks = [];

      for (const pu of productUnits) {
        let available = 0;
        if (pu.is_bundle) {
          const availInfo = await this.getAvailableStock(pu.id);
          available = availInfo.availableUnits;
        } else if (pu.stock_mode === 'allocated') {
          available = parseFloat(pu.allocated_stock) || 0;
        } else {
          const factor = parseFloat(pu.conversion_factor);
          available = factor > 0 ? Math.floor(totalBase / factor * 10000) / 10000 : 0;
        }

        unitStocks.push({
          id: pu.id,
          unitName: pu.unit_name,
          conversionFactor: parseFloat(pu.conversion_factor),
          sellingPrice: parseFloat(pu.selling_price),
          stockMode: pu.stock_mode || 'floating',
          allocatedStock: parseFloat(pu.allocated_stock) || 0,
          isBundle: !!pu.is_bundle,
          available
        });
      }

      if (batches.length === 0 && unitStocks.some(u => u.isBundle)) {
        totalBase = unitStocks[0]?.available || 0;
      }

      if (batches.length > 0 || productUnits.length > 0) {
        summary.push({
          itemId: item.id,
          itemName: item.name,
          baseUnit: item.base_unit,
          totalBaseUnits: totalBase,
          batches: batches.map(b => ({
            id: b.id,
            initialQuantity: parseFloat(b.initial_quantity),
            remainingQuantity: parseFloat(b.remaining_quantity),
            baseCostPrice: parseFloat(b.base_cost_price),
            receivedDate: b.received_date,
            stockPercentage: ((parseFloat(b.remaining_quantity) / parseFloat(b.initial_quantity)) * 100).toFixed(1)
          })),
          productUnits: unitStocks
        });
      }
    }

    return summary;
  }

  /**
   * Repackage / allocate physical stock quotas across selling units of a master item.
   * Ensures sum(allocated_qty * conversion_factor) <= total base units in warehouse.
   */
  static async repackageItemStock({ itemId, itemName, allocations }) {
    return db.transaction(async (trx) => {
      const targetItem = itemId
        ? await trx('items').where({ id: itemId }).first()
        : await trx('items').whereRaw('LOWER(name) = ?', [itemName.trim().toLowerCase()]).first();

      if (!targetItem) {
        throw Object.assign(new Error('Barang master tidak ditemukan.'), { status: 404 });
      }

      // Fetch active batches to know total base stock
      const batches = await trx('inventory_batches')
        .where(function() {
          this.where('item_id', targetItem.id).orWhere('item_name', targetItem.name);
        })
        .where('remaining_quantity', '>', 0);

      const totalBaseStock = batches.reduce((sum, b) => sum + parseFloat(b.remaining_quantity), 0);

      let totalBaseNeeded = 0;
      const unitUpdates = [];

      for (const alloc of allocations) {
        const targetUnitId = alloc.productUnitId || alloc.unitId || alloc.id;
        if (!targetUnitId) {
          throw Object.assign(new Error('ID satuan unit wajib diisi.'), { status: 400 });
        }
        const unit = await trx('product_units').where({ id: targetUnitId }).first();
        if (!unit) {
          throw Object.assign(new Error(`Satuan unit #${targetUnitId} tidak ditemukan.`), { status: 400 });
        }
        const qty = Math.max(0, parseFloat(alloc.allocatedStock) || 0);
        const factor = parseFloat(unit.conversion_factor);
        totalBaseNeeded += qty * factor;
        unitUpdates.push({ unitId: unit.id, qty });
      }

      if (totalBaseNeeded > totalBaseStock + 0.0001) {
        throw Object.assign(
          new Error(`Total alokasi (${totalBaseNeeded} ${targetItem.base_unit}) melebihi stok fisik gudang (${totalBaseStock} ${targetItem.base_unit})!`),
          { status: 400 }
        );
      }

      for (const up of unitUpdates) {
        await trx('product_units').where({ id: up.unitId }).update({
          stock_mode: 'allocated',
          allocated_stock: up.qty,
          updated_at: trx.fn.now()
        });
      }

      return {
        itemId: targetItem.id,
        itemName: targetItem.name,
        totalBaseStock,
        totalBaseAllocated: totalBaseNeeded,
        remainingBaseUnallocated: totalBaseStock - totalBaseNeeded,
        baseUnit: targetItem.base_unit
      };
    });
  }

  /**
   * Reset all units of a master item back to Floating Pool mode.
   */
  static async resetToFloating({ itemId, itemName }) {
    return db.transaction(async (trx) => {
      const targetItem = itemId
        ? await trx('items').where({ id: itemId }).first()
        : await trx('items').whereRaw('LOWER(name) = ?', [itemName.trim().toLowerCase()]).first();

      if (!targetItem) {
        throw Object.assign(new Error('Barang master tidak ditemukan.'), { status: 404 });
      }

      await trx('product_units')
        .where(function() {
          this.where('item_id', targetItem.id).orWhere('item_name', targetItem.name);
        })
        .update({
          stock_mode: 'floating',
          allocated_stock: 0,
          updated_at: trx.fn.now()
        });

      return {
        success: true,
        message: `Stok barang ${targetItem.name} berhasil dikembalikan ke mode Floating Pool (Fleksibel).`
      };
    });
  }

  /**
   * Create a composite bundle package (e.g. Hampers Buah / Paket Sembako).
   * Model B: On-Demand Just-In-Time Bill of Materials.
   */
  static async createBundlePackage({ name, sellingPrice, components, description = null, resellerVisible = true }) {
    return db.transaction(async (trx) => {
      // 1. Create or find bundle item master
      let bundleItem = await trx('items').whereRaw('LOWER(name) = ?', [name.trim().toLowerCase()]).first();
      if (!bundleItem) {
        const [newId] = await trx('items').insert({
          name: name.trim(),
          base_unit: 'Paket',
          category: 'Bundling / Hampers',
          description: description || 'Paket hampers komposit campuran buah/barang'
        });
        bundleItem = await trx('items').where({ id: newId }).first();
      }

      // 2. Create or update product unit marked as is_bundle
      let productUnit = await trx('product_units').where({ item_id: bundleItem.id, unit_name: 'Paket' }).first();
      if (productUnit) {
        await trx('product_units').where({ id: productUnit.id }).update({
          selling_price: parseFloat(sellingPrice),
          is_bundle: true,
          stock_mode: 'floating',
          reseller_visible: !!resellerVisible,
          updated_at: trx.fn.now()
        });
      } else {
        const [unitId] = await trx('product_units').insert({
          item_id: bundleItem.id,
          item_name: bundleItem.name,
          unit_name: 'Paket',
          conversion_factor: 1,
          pricing_method: 'manual',
          selling_price: parseFloat(sellingPrice),
          is_bundle: true,
          stock_mode: 'floating',
          reseller_visible: !!resellerVisible
        });
        productUnit = await trx('product_units').where({ id: unitId }).first();
      }

      // 3. Clear existing recipe and insert new bundle_items
      await trx('bundle_items').where({ bundle_unit_id: productUnit.id }).delete();

      for (const comp of components) {
        const compItem = await trx('items').where({ id: comp.itemId }).first();
        if (!compItem) {
          throw Object.assign(new Error(`Item komponen ID ${comp.itemId} tidak ditemukan.`), { status: 400 });
        }
        await trx('bundle_items').insert({
          bundle_unit_id: productUnit.id,
          component_item_id: compItem.id,
          component_item_name: compItem.name,
          quantity_needed: parseFloat(comp.quantityNeeded)
        });
      }

      return {
        bundleItem,
        productUnit,
        components
      };
    });
  }

  /**
   * Get recipe components for a bundle unit.
   */
  static async getBundleRecipe(bundleUnitId) {
    return db('bundle_items')
      .where({ bundle_unit_id: bundleUnitId })
      .leftJoin('items', 'bundle_items.component_item_id', 'items.id')
      .select(
        'bundle_items.*',
        'items.base_unit as component_base_unit'
      );
  }
}

module.exports = InventoryService;
