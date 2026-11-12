const db = require('../config/database');
const ItemModel = require('./ItemModel');

class ProductUnitModel {
  static async findAll() {
    return db('product_units')
      .leftJoin('items', 'product_units.item_id', 'items.id')
      .select(
        'product_units.*',
        'items.name as master_item_name',
        'items.base_unit as master_base_unit'
      )
      .where({ 'product_units.is_active': true })
      .orderBy('product_units.item_name')
      .orderBy('product_units.conversion_factor', 'asc');
  }

  static async findById(id) {
    return db('product_units')
      .leftJoin('items', 'product_units.item_id', 'items.id')
      .select(
        'product_units.*',
        'items.base_unit as master_base_unit'
      )
      .where('product_units.id', id)
      .first();
  }

  static async findByItem(itemName) {
    return db('product_units')
      .where({ item_name: itemName, is_active: true })
      .orderBy('conversion_factor', 'asc');
  }

  static async findByItemId(itemId) {
    return db('product_units')
      .where({ item_id: itemId, is_active: true })
      .orderBy('conversion_factor', 'asc');
  }

  /** Get products visible to resellers */
  static async findResellerVisible() {
    return db('product_units')
      .leftJoin('items', 'product_units.item_id', 'items.id')
      .select(
        'product_units.*',
        'items.base_unit as master_base_unit'
      )
      .where({ 'product_units.is_active': true, 'product_units.reseller_visible': true })
      .orderBy('product_units.item_name')
      .orderBy('product_units.conversion_factor', 'asc');
  }

  static async create({ itemId, itemName, unitName, conversionFactor, pricingMethod, marginPercentage, sellingPrice, resellerVisible = true }, trx = null) {
    const query = trx ? trx('product_units') : db('product_units');
    const [id] = await query.insert({
      item_id: itemId || null,
      item_name: itemName.trim(),
      unit_name: unitName.trim(),
      conversion_factor: parseFloat(conversionFactor),
      pricing_method: pricingMethod || 'manual',
      margin_percentage: marginPercentage !== undefined && marginPercentage !== null ? parseFloat(marginPercentage) : null,
      selling_price: parseFloat(sellingPrice),
      reseller_visible: resellerVisible !== undefined ? !!resellerVisible : true
    });
    return id;
  }

  static async update(id, data, trx = null) {
    const updateData = { updated_at: db.fn.now() };
    if (data.itemId !== undefined) updateData.item_id = data.itemId;
    if (data.itemName !== undefined) updateData.item_name = data.itemName.trim();
    if (data.unitName !== undefined) updateData.unit_name = data.unitName.trim();
    if (data.conversionFactor !== undefined) updateData.conversion_factor = parseFloat(data.conversionFactor);
    if (data.pricingMethod !== undefined) updateData.pricing_method = data.pricingMethod;
    if (data.marginPercentage !== undefined) updateData.margin_percentage = data.marginPercentage !== null ? parseFloat(data.marginPercentage) : null;
    if (data.sellingPrice !== undefined) updateData.selling_price = parseFloat(data.sellingPrice);
    if (data.resellerVisible !== undefined) updateData.reseller_visible = !!data.resellerVisible;
    if (data.isActive !== undefined) updateData.is_active = !!data.isActive;

    const query = trx ? trx('product_units') : db('product_units');
    return query.where({ id }).update(updateData);
  }

  static async deactivate(id) {
    return db('product_units').where({ id }).update({ is_active: false, updated_at: db.fn.now() });
  }

  /**
   * Batch setup multi-units for a single master item in one atomic transaction.
   * Challenge response: Allows setup of Item "XXX" with Sprei M, Sprei L, Sprei XL simultaneously.
   */
  static async batchSetup({ itemId, itemName, baseUnit = 'Meter', category, units }) {
    return db.transaction(async (trx) => {
      // 1. Resolve master item
      let masterItem;
      if (itemId) {
        masterItem = await trx('items').where({ id: itemId }).first();
        if (masterItem && itemName && masterItem.name !== itemName.trim()) {
          await trx('items').where({ id: itemId }).update({ name: itemName.trim(), updated_at: trx.fn.now() });
          masterItem.name = itemName.trim();
        }
      } else {
        masterItem = await trx('items').whereRaw('LOWER(name) = ?', [itemName.trim().toLowerCase()]).first();
        if (!masterItem) {
          const [newId] = await trx('items').insert({
            name: itemName.trim(),
            base_unit: baseUnit.trim() || 'Meter',
            category: category ? category.trim() : null
          });
          masterItem = await trx('items').where({ id: newId }).first();
        }
      }

      // Calculate current base cost (HPP per base unit) to resolve percentage margins if needed
      const batches = await trx('inventory_batches')
        .where(function() {
          this.where('item_id', masterItem.id)
              .orWhere('item_name', masterItem.name);
        })
        .where('remaining_quantity', '>', 0);

      let totalBaseStock = 0;
      let totalCostVal = 0;
      batches.forEach(b => {
        const qty = parseFloat(b.remaining_quantity);
        const cost = parseFloat(b.base_cost_price);
        totalBaseStock += qty;
        totalCostVal += qty * cost;
      });
      const avgBaseHpp = totalBaseStock > 0 ? (totalCostVal / totalBaseStock) : 0;

      // 2. Process each unit
      const savedUnits = [];
      for (const unit of units) {
        const conversionFactor = parseFloat(unit.conversionFactor);
        let finalPrice = parseFloat(unit.sellingPrice);

        // If percentage margin is selected and selling price is not explicitly set, compute it
        if (unit.pricingMethod === 'percentage_margin' && unit.marginPercentage !== undefined && unit.marginPercentage !== null) {
          const margin = parseFloat(unit.marginPercentage);
          const computedHpp = avgBaseHpp * conversionFactor;
          if (computedHpp > 0 && (!finalPrice || isNaN(finalPrice))) {
            finalPrice = Math.round(computedHpp * (1 + margin / 100));
          }
        }

        // Check if this unit already exists for this master item
        const existing = await trx('product_units')
          .where(function() {
            this.where('item_id', masterItem.id)
                .orWhere('item_name', masterItem.name);
          })
          .where({ unit_name: unit.unitName.trim() })
          .first();

        let unitId;
        if (existing) {
          await trx('product_units').where({ id: existing.id }).update({
            item_id: masterItem.id,
            item_name: masterItem.name,
            unit_name: unit.unitName.trim(),
            conversion_factor: conversionFactor,
            pricing_method: unit.pricingMethod || 'manual',
            margin_percentage: unit.marginPercentage ? parseFloat(unit.marginPercentage) : null,
            selling_price: finalPrice || existing.selling_price,
            reseller_visible: unit.resellerVisible !== undefined ? !!unit.resellerVisible : true,
            is_active: true,
            updated_at: trx.fn.now()
          });
          unitId = existing.id;
        } else {
          const [newUnitId] = await trx('product_units').insert({
            item_id: masterItem.id,
            item_name: masterItem.name,
            unit_name: unit.unitName.trim(),
            conversion_factor: conversionFactor,
            pricing_method: unit.pricingMethod || 'manual',
            margin_percentage: unit.marginPercentage ? parseFloat(unit.marginPercentage) : null,
            selling_price: finalPrice || 0,
            reseller_visible: unit.resellerVisible !== undefined ? !!unit.resellerVisible : true,
            is_active: true
          });
          unitId = newUnitId;
        }

        savedUnits.push({
          id: unitId,
          itemId: masterItem.id,
          itemName: masterItem.name,
          unitName: unit.unitName.trim(),
          conversionFactor,
          pricingMethod: unit.pricingMethod,
          marginPercentage: unit.marginPercentage,
          sellingPrice: finalPrice
        });
      }

      return {
        item: masterItem,
        units: savedUnits
      };
    });
  }
}

module.exports = ProductUnitModel;
