module.exports = {
  development: {
    client: "pg",
    connection: "postgres://localhost/spkulehas",
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/dev"
    },
    useNullAsDefault: true
  },
  test: {
    client: "pg",
    connection: "postgres://localhost/spkulehas_test",
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/test"
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
      directory: "./db/seeds/staging"
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
      directory: "./db/seeds/prod"
    },
    useNullAsDefault: true
  }
};
