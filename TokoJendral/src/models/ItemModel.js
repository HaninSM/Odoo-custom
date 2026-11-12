const db = require('../config/database');

class ItemModel {
  static async findAll() {
    return db('items')
      .where({ is_active: true })
      .orderBy('name', 'asc');
  }

  static async findById(id) {
    return db('items').where({ id }).first();
  }

  static async findByName(name) {
    if (!name) return null;
    return db('items')
      .whereRaw('LOWER(name) = ?', [name.trim().toLowerCase()])
      .first();
  }

  static async create({ name, baseUnit = 'Meter', category = null, description = null }, trx = null) {
    const query = trx ? trx('items') : db('items');
    const [id] = await query.insert({
      name: name.trim(),
      base_unit: baseUnit.trim() || 'Meter',
      category: category ? category.trim() : null,
      description: description ? description.trim() : null
    });
    return id;
  }

  static async findOrCreate({ name, baseUnit = 'Meter', category = null, description = null }, trx = null) {
    const existing = await this.findByName(name);
    if (existing) return existing;

    const id = await this.create({ name, baseUnit, category, description }, trx);
    return this.findById(id);
  }

  static async update(id, data) {
    const updateData = { updated_at: db.fn.now() };
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.baseUnit !== undefined) updateData.base_unit = data.baseUnit.trim();
    if (data.category !== undefined) updateData.category = data.category ? data.category.trim() : null;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    return db('items').where({ id }).update(updateData);
  }

  /**
   * Get all master items with their inventory base stock and associated selling units
   */
  static async getItemsWithUnitsAndStock() {
    const items = await this.findAll();

    const result = [];
    for (const item of items) {
      // Get stock and weighted cost from inventory_batches
      const batches = await db('inventory_batches')
        .where(function() {
          this.where('item_id', item.id)
              .orWhere('item_name', item.name);
        })
        .where('remaining_quantity', '>', 0)
        .orderBy('received_date', 'asc');

      let totalBaseStock = 0;
      let totalCostVal = 0;

      batches.forEach(b => {
        const qty = parseFloat(b.remaining_quantity);
        const cost = parseFloat(b.base_cost_price);
        totalBaseStock += qty;
        totalCostVal += qty * cost;
      });

      const avgBaseHpp = totalBaseStock > 0 ? (totalCostVal / totalBaseStock) : 0;

      // Get selling units for this item
      const units = await db('product_units')
        .where(function() {
          this.where('item_id', item.id)
              .orWhere('item_name', item.name);
        })
        .where({ is_active: true })
        .orderBy('conversion_factor', 'asc');

      const unitsWithStock = [];
      for (const u of units) {
        const factor = parseFloat(u.conversion_factor);
        let available = 0;
        let unitHpp = avgBaseHpp * factor;
        let bundleComponents = [];

        if (u.is_bundle) {
          // Composite bundle: fetch recipe from bundle_items
          bundleComponents = await db('bundle_items')
            .where({ bundle_unit_id: u.id });

          if (bundleComponents.length > 0) {
            let minPossibleBundles = Infinity;
            let totalBundleHpp = 0;

            for (const comp of bundleComponents) {
              const compBatches = await db('inventory_batches')
                .where(function() {
                  this.where('item_id', comp.component_item_id)
                      .orWhere('item_name', comp.component_item_name);
                })
                .where('remaining_quantity', '>', 0);

              let compStock = 0;
              let compCostVal = 0;
              compBatches.forEach(cb => {
                const q = parseFloat(cb.remaining_quantity);
                const c = parseFloat(cb.base_cost_price);
                compStock += q;
                compCostVal += q * c;
              });
              const compAvgHpp = compStock > 0 ? (compCostVal / compStock) : 0;
              const needed = parseFloat(comp.quantity_needed);

              totalBundleHpp += compAvgHpp * needed;
              const possible = needed > 0 ? Math.floor(compStock / needed) : 0;
              if (possible < minPossibleBundles) {
                minPossibleBundles = possible;
              }
            }

            available = minPossibleBundles === Infinity ? 0 : minPossibleBundles;
            unitHpp = totalBundleHpp;
          }
        } else if (u.stock_mode === 'allocated') {
          // Physical allocation mode: fixed quota set by repackage
          available = parseFloat(u.allocated_stock) || 0;
        } else {
          // Floating pool mode (default): maximum convertible on-demand
          available = factor > 0 ? Math.floor(totalBaseStock / factor * 100) / 100 : 0;
        }

        unitsWithStock.push({
          id: u.id,
          unitName: u.unit_name,
          conversionFactor: factor,
          pricingMethod: u.pricing_method,
          marginPercentage: u.margin_percentage ? parseFloat(u.margin_percentage) : null,
          sellingPrice: parseFloat(u.selling_price),
          resellerVisible: !!u.reseller_visible,
          unitHpp: Math.round(unitHpp),
          available,
          stockMode: u.stock_mode || 'floating',
          allocatedStock: parseFloat(u.allocated_stock) || 0,
          isBundle: !!u.is_bundle,
          bundleComponents
        });
      }

      result.push({
        id: item.id,
        name: item.name,
        baseUnit: item.base_unit,
        category: item.category,
        description: item.description,
        totalBaseStock,
        avgBaseHpp: Math.round(avgBaseHpp),
        units: unitsWithStock
      });
    }

    return result;
  }
}

module.exports = ItemModel;
