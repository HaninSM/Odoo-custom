/**
 * Initial database schema for POS & Inventory Management System.
 * All quantity values are stored in base units (e.g., meters) for consistency.
 * FIFO inventory tracking via inventory_batches with received_date ordering.
 */
exports.up = function (knex) {
  return knex.schema
    // Global system settings (key-value store)
    .createTable('system_settings', (table) => {
      table.string('key').primary();
      table.string('value').notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })

    // Users with role-based access
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password_hash').notNullable();
      table.enu('role', ['owner', 'cashier', 'reseller']).notNullable();
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })

    // Master items table (parent entity)
    .createTable('items', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.string('base_unit').notNullable().defaultTo('Meter');   // e.g. Meter, Pcs, Kg
      table.string('category');
      table.text('description');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })

    // Suppliers master data
    .createTable('suppliers', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('phone');
      table.text('address');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })

    // Purchase orders from suppliers
    .createTable('purchases', (table) => {
      table.increments('id').primary();
      table.integer('supplier_id').unsigned().references('id').inTable('suppliers').onDelete('RESTRICT');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('RESTRICT');
      table.date('purchase_date').notNullable();
      table.decimal('total_cost', 15, 2).notNullable();
      table.text('notes');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })

    // FIFO inventory batches — each purchase line creates a batch
    .createTable('inventory_batches', (table) => {
      table.increments('id').primary();
      table.integer('purchase_id').unsigned().references('id').inTable('purchases').onDelete('RESTRICT');
      table.integer('item_id').unsigned().references('id').inTable('items').onDelete('RESTRICT');
      table.string('item_name').notNullable();
      table.decimal('initial_quantity', 15, 4).notNullable();       // in base units (meters)
      table.decimal('remaining_quantity', 15, 4).notNullable();     // in base units (meters)
      table.decimal('base_cost_price', 15, 2).notNullable();        // cost per base unit
      table.date('received_date').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());

      table.index(['item_id', 'remaining_quantity']);
      table.index(['item_name', 'remaining_quantity']);
      table.index('received_date');
    })

    // Product unit conversion definitions
    .createTable('product_units', (table) => {
      table.increments('id').primary();
      table.integer('item_id').unsigned().references('id').inTable('items').onDelete('CASCADE');
      table.string('item_name').notNullable();
      table.string('unit_name').notNullable();                      // e.g., "Sprei M", "1/2 Roll", "Kodi"
      table.decimal('conversion_factor', 15, 4).notNullable();      // how many base units per this unit
      table.enu('pricing_method', ['manual', 'percentage_margin']).defaultTo('manual');
      table.decimal('margin_percentage', 5, 2);                     // e.g., 30.00 for 30%
      table.decimal('selling_price', 15, 2).notNullable();           // final selling price
      table.boolean('is_active').defaultTo(true);
      table.boolean('reseller_visible').defaultTo(true);             // whether resellers can see this product
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());

      table.unique(['item_name', 'unit_name']);
    })

    // Sales transactions header
    .createTable('transactions', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('RESTRICT');
      table.string('customer_name');                                // optional customer info
      table.decimal('total_amount', 15, 2).notNullable();
      table.enu('payment_method', ['CASH', 'TRANSFER', 'QRIS']).notNullable();
      table.enu('payment_status', ['pending', 'paid', 'cancelled']).defaultTo('pending');
      table.decimal('amount_paid', 15, 2);                          // for CASH: amount tendered
      table.decimal('change_amount', 15, 2);                        // for CASH: change returned
      table.timestamp('transaction_date').defaultTo(knex.fn.now());
      table.timestamp('created_at').defaultTo(knex.fn.now());

      table.index('user_id');
      table.index('transaction_date');
    })

    // Sales transaction line items
    .createTable('transaction_items', (table) => {
      table.increments('id').primary();
      table.integer('transaction_id').unsigned().references('id').inTable('transactions').onDelete('CASCADE');
      table.integer('batch_id').unsigned().references('id').inTable('inventory_batches').onDelete('RESTRICT');
      table.integer('product_unit_id').unsigned().references('id').inTable('product_units').onDelete('RESTRICT');
      table.decimal('quantity_sold', 15, 4).notNullable();          // quantity in product units
      table.decimal('base_quantity_deducted', 15, 4).notNullable(); // quantity in base units deducted
      table.decimal('unit_price', 15, 2).notNullable();             // selling price per unit at time of sale
      table.decimal('cost_price', 15, 2).notNullable();             // HPP per unit at time of sale
      table.decimal('subtotal_price', 15, 2).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })

    // Operational expenses
    .createTable('expenses', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('RESTRICT');
      table.date('expense_date').notNullable();
      table.string('category').notNullable();
      table.decimal('amount', 15, 2).notNullable();
      table.text('notes');
      table.timestamp('created_at').defaultTo(knex.fn.now());

      table.index('expense_date');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('expenses')
    .dropTableIfExists('transaction_items')
    .dropTableIfExists('transactions')
    .dropTableIfExists('product_units')
    .dropTableIfExists('inventory_batches')
    .dropTableIfExists('purchases')
    .dropTableIfExists('items')
    .dropTableIfExists('suppliers')
    .dropTableIfExists('users')
    .dropTableIfExists('system_settings');
};
