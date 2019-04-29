const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'db',
      database: 'test',
      user: 'test',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, '/server/db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/server/db/seeds'),
    },
  },

  test: {
    client: 'pg',
    connection: {
      host: 'db_test',
      database: 'test',
      user: 'test',
      password: 'password',
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      directory: path.join(__dirname, '/server/db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/server/db/seeds'),
    },
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, '/server/db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/server/db/seeds'),
    },
  },

};
