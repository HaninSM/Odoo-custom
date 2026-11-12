const InventoryBatchModel = require('../models/InventoryBatchModel');
const ProductUnitModel = require('../models/ProductUnitModel');

class PricingService {
  /**
   * Calculate average base cost price per base unit (e.g. per Meter) for an item.
   */
  static async calculateItemBaseCost(itemNameOrId) {
    const batches = await InventoryBatchModel.getActiveBatchesByItem(itemNameOrId);
    if (!batches || batches.length === 0) {
      return { avgBaseCost: 0, totalRemainingStock: 0 };
    }

    let totalCost = 0;
    let totalQty = 0;
    for (const batch of batches) {
      const qty = parseFloat(batch.remaining_quantity);
      const cost = parseFloat(batch.base_cost_price);
      totalCost += qty * cost;
      totalQty += qty;
    }

    const avgBaseCost = totalQty > 0 ? totalCost / totalQty : 0;
    return {
      avgBaseCost: Math.round(avgBaseCost * 100) / 100,
      totalRemainingStock: totalQty
    };
  }

  /**
   * Calculate the HPP (Harga Pokok Penjualan / Cost of Goods Sold) for a product unit.
   * HPP = Average base cost price * conversion factor
   *
   * Uses weighted average of active FIFO batches for the item.
   */
  static async calculateHpp(productUnitId) {
    const productUnit = await ProductUnitModel.findById(productUnitId);
    if (!productUnit) throw Object.assign(new Error('Product unit tidak ditemukan.'), { status: 404 });

    const batches = await InventoryBatchModel.getActiveBatchesByItem(productUnit.item_name);
    if (batches.length === 0) return { hpp: 0, avgBaseCost: 0 };

    // Weighted average cost of active batches
    let totalCost = 0;
    let totalQty = 0;
    for (const batch of batches) {
      const qty = parseFloat(batch.remaining_quantity);
      const cost = parseFloat(batch.base_cost_price);
      totalCost += qty * cost;
      totalQty += qty;
    }

    const avgBaseCost = totalQty > 0 ? totalCost / totalQty : 0;
    const hpp = avgBaseCost * parseFloat(productUnit.conversion_factor);

    return { hpp, avgBaseCost, conversionFactor: parseFloat(productUnit.conversion_factor) };
  }

  /**
   * Calculate selling price based on margin percentage over HPP.
   * Selling Price = HPP * (1 + margin/100)
   */
  static async calculateSellingPrice(productUnitId, marginPercentage) {
    const { hpp } = await this.calculateHpp(productUnitId);
    const sellingPrice = hpp * (1 + marginPercentage / 100);
    return { hpp, marginPercentage, sellingPrice: Math.round(sellingPrice) };
  }

  /**
   * Update selling price for a product unit.
   * If pricing_method is 'percentage_margin', auto-calculates from HPP.
   */
  static async updatePrice(productUnitId, { pricingMethod, marginPercentage, sellingPrice }) {
    const productUnit = await ProductUnitModel.findById(productUnitId);
    if (!productUnit) throw Object.assign(new Error('Product unit tidak ditemukan.'), { status: 404 });

    if (pricingMethod === 'percentage_margin') {
      const calculated = await this.calculateSellingPrice(productUnitId, marginPercentage);
      await ProductUnitModel.update(productUnitId, {
        pricingMethod: 'percentage_margin',
        marginPercentage,
        sellingPrice: calculated.sellingPrice
      });
      return calculated;
    }

    // Manual pricing
    await ProductUnitModel.update(productUnitId, {
      pricingMethod: 'manual',
      marginPercentage: null,
      sellingPrice
    });
    return { sellingPrice };
  }

  /**
   * Automatically recalculate and sync selling prices for all percentage_margin units of an item.
   * Called during inbound purchases so that items with margin pricing have their selling prices
   * automatically generated or updated according to the new weighted HPP.
   *
   * Historical transactions remain 100% untouched because transaction_items store snapshot unit_price and cost_price.
   */
  static async syncItemMarginPrices(trx, itemNameOrId) {
    const batchesQuery = trx('inventory_batches')
      .where('remaining_quantity', '>', 0);

    if (typeof itemNameOrId === 'number') {
      batchesQuery.where(function() {
        this.where('item_id', itemNameOrId).orWhere('item_name', String(itemNameOrId));
      });
    } else {
      batchesQuery.where('item_name', itemNameOrId);
    }

    const batches = await batchesQuery;
    if (!batches || batches.length === 0) return [];

    let totalCost = 0;
    let totalQty = 0;
    for (const b of batches) {
      const q = parseFloat(b.remaining_quantity);
      const c = parseFloat(b.base_cost_price);
      totalCost += q * c;
      totalQty += q;
    }
    const avgBaseCost = totalQty > 0 ? totalCost / totalQty : 0;
    if (avgBaseCost <= 0) return [];

    const unitsQuery = trx('product_units')
      .where({ is_active: true, pricing_method: 'percentage_margin' });

    if (typeof itemNameOrId === 'number') {
      unitsQuery.where(function() {
        this.where('item_id', itemNameOrId).orWhere('item_name', String(itemNameOrId));
      });
    } else {
      unitsQuery.where('item_name', itemNameOrId);
    }

    const units = await unitsQuery;
    const updated = [];

    for (const unit of units) {
      if (unit.margin_percentage !== null && unit.margin_percentage !== undefined) {
        const factor = parseFloat(unit.conversion_factor);
        const margin = parseFloat(unit.margin_percentage);
        const unitHpp = avgBaseCost * factor;
        const newSellingPrice = Math.round(unitHpp * (1 + margin / 100));

        if (newSellingPrice > 0 && newSellingPrice !== parseFloat(unit.selling_price)) {
          await trx('product_units')
            .where({ id: unit.id })
            .update({
              selling_price: newSellingPrice,
              updated_at: trx.fn.now()
            });

          updated.push({
            id: unit.id,
            unitName: unit.unit_name,
            oldPrice: parseFloat(unit.selling_price),
            newPrice: newSellingPrice,
            hpp: Math.round(unitHpp),
            marginPercentage: margin
          });
        }
      }
    }

    return updated;
  }
}

module.exports = PricingService;
