// server/models/index.js

import { Sequelize } from "sequelize";
import { config } from "../config/config.js";

const sequelize = new Sequelize(config.db.url, {
  dialect: config.db.dialect,
  pool: config.db.pool,
  logging: false,
  dialectOptions: config.db.dialectOptions,
});

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
