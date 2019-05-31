const path = require('path');
const { knexSnakeCaseMappers } = require('objection');

const commonSettings = {
  client: 'pg',
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
  ...knexSnakeCaseMappers(),
};

module.exports = {
  development: {
    ...commonSettings,
    connection: {
      host: 'localhost',
      port: 5762,
      database: 'test',
      user: 'test',
      password: 'pass',
    },
  },

  test: {
    ...commonSettings,
    connection: {
      host: 'localhost',
      port: 5763,
      database: 'test',
      user: 'test',
      password: 'password',
    },
    seeds: {
      directory: path.join(__dirname, '/server/db/test_seeds'),
    },
  },

  production: {
    ...commonSettings,
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    },
  },
};
