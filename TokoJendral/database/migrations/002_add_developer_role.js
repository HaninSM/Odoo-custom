/**
 * Migration to add 'developer' role to users table in SQLite.
 */
exports.config = { transaction: false };

exports.up = async function (knex) {
  await knex.raw('PRAGMA foreign_keys = OFF;');

  await knex.schema.createTable('users_new', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.enu('role', ['owner', 'cashier', 'reseller', 'developer']).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.raw('INSERT INTO users_new SELECT * FROM users;');

  await knex.schema.dropTable('users');
  await knex.schema.renameTable('users_new', 'users');

  await knex.raw('PRAGMA foreign_keys = ON;');
};

exports.down = async function (knex) {
  await knex.raw('PRAGMA foreign_keys = OFF;');

  await knex.schema.createTable('users_old', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.enu('role', ['owner', 'cashier', 'reseller']).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.raw("INSERT INTO users_old SELECT * FROM users WHERE role != 'developer';");

  await knex.schema.dropTable('users');
  await knex.schema.renameTable('users_old', 'users');

  await knex.raw('PRAGMA foreign_keys = ON;');
};
