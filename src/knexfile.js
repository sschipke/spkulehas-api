export default {
  development: {
    client: "pg",
    connection:
      process.env.DATABASE_URL ||
      // Default matches README Docker Postgres (superuser `postgres`); URLs without a user use the OS login and fail on Docker.
      "postgres://postgres@127.0.0.1:5432/spkulehas",
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/dev",
      loadExtensions: [".cjs"]
    },
    useNullAsDefault: true
  },
  test: {
    client: "pg",
    connection:
      process.env.DATABASE_URL_TEST ||
      process.env.DATABASE_URL?.replace(/\/[^/]+$/, "/spkulehas_test") ||
      "postgres://postgres@127.0.0.1:5432/spkulehas_test",
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/test",
      loadExtensions: [".cjs"]
    },
    useNullAsDefault: true
  },
  staging: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/staging",
      loadExtensions: [".cjs"]
    },
    useNullAsDefault: true
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/prod",
      loadExtensions: [".cjs"]
    },
    useNullAsDefault: true
  }
};
