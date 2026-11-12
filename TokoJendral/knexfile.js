require('dotenv').config();

module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: './database/pos.db'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  },
  production: {
    client: 'better-sqlite3',
    connection: {
      filename: process.env.DB_PATH || './database/pos.db'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  }
};
