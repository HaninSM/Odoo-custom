/**
 * Migration 003: Add support for Physical Allocation (Repackage) and Composite Bundling (Hampers/Kits).
 *
 * 1. product_units:
 *    - stock_mode: 'floating' | 'allocated' (default: 'floating')
 *    - allocated_stock: decimal(15, 4) (default: 0)
 *    - is_bundle: boolean (default: false)
 *
 * 2. bundle_items:
 *    - Bill of Materials (BOM) mapping bundle units to individual master items and required quantities.
 */
exports.up = async function (knex) {
  // Add columns to product_units
  await knex.schema.table('product_units', (table) => {
    table.string('stock_mode').defaultTo('floating'); // 'floating' or 'allocated'
    table.decimal('allocated_stock', 15, 4).defaultTo(0);
    table.boolean('is_bundle').defaultTo(false);
  });

  // Create bundle_items table for Composite Bundling (Hampers / Paket Sembako)
  await knex.schema.createTable('bundle_items', (table) => {
    table.increments('id').primary();
    table.integer('bundle_unit_id').unsigned().notNullable()
      .references('id').inTable('product_units').onDelete('CASCADE');
    table.integer('component_item_id').unsigned().notNullable()
      .references('id').inTable('items').onDelete('RESTRICT');
    table.string('component_item_name').notNullable();
    table.decimal('quantity_needed', 15, 4).notNullable(); // in base unit of component item
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('bundle_unit_id');
    table.index('component_item_id');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('bundle_items');
  await knex.schema.table('product_units', (table) => {
    table.dropColumn('is_bundle');
    table.dropColumn('allocated_stock');
    table.dropColumn('stock_mode');
  });
};
