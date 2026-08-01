require("reflect-metadata");
require("dotenv").config();
const { DataSource } = require("typeorm");

module.exports = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  migrations: ["migrations/*.js"],
  migrationsTableName: "typeorm_migrations",
  synchronize: false,
});
