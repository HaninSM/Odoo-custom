const bcrypt = require('bcryptjs');

/**
 * Seeds the database with default system settings and an owner account.
 * Default owner credentials: admin@pos.com / admin123
 */
exports.seed = async function (knex) {
  // Clear existing data in reverse dependency order
  await knex('expenses').del();
  await knex('transaction_items').del();
  await knex('transactions').del();
  await knex('product_units').del();
  await knex('inventory_batches').del();
  await knex('purchases').del();
  await knex('items').del();
  await knex('suppliers').del();
  await knex('users').del();
  await knex('system_settings').del();

  // System settings
  await knex('system_settings').insert([
    { key: 'low_stock_threshold_percentage', value: '20' },
    { key: 'store_name', value: 'Toko POS' },
    { key: 'store_email', value: 'owner@pos.com' },
    { key: 'currency', value: 'IDR' }
  ]);

  // Default accounts (owner and developer)
  const ownerHash = await bcrypt.hash('admin123', 10);
  const devHash = await bcrypt.hash('developer123', 10);

  await knex('users').insert([
    {
      name: 'Admin Pemilik',
      email: 'admin@pos.com',
      password_hash: ownerHash,
      role: 'owner',
      is_active: true
    },
    {
      name: 'System Developer',
      email: 'developer@pos.com',
      password_hash: devHash,
      role: 'developer',
      is_active: true
    }
  ]);
};
