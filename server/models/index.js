// server/models/index.js

import { Sequelize } from "sequelize";
import { config } from "../config/config.js";

let sequelize;

if (config.db.url) {
  sequelize = new Sequelize(config.db.url, {
    dialect: config.db.dialect,
    pool: config.db.pool,
    logging: false,
    dialectOptions: config.db.dialectOptions,
  });
} else {
  sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    {
      host: config.db.host,
      port: config.db.port,
      dialect: config.db.dialect,
      pool: config.db.pool,
      logging: false,
      dialectOptions: config.db.dialectOptions,
    }
  );
}

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testConnection();

export default sequelize;
