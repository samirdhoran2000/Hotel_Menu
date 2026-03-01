// src/index.js
import fs from "node:fs";
import https from "https";

import app from "./app.js";
import { config } from "./config/config.js";

// HTTPS options
const options = {
  key: fs.readFileSync(config.sslKeyPath),
  cert: fs.readFileSync(config.sslCertPath),
};

// Create HTTPS server
const server = https.createServer(options, app);

// Start server
// Import sequelize
import sequelize from "./models/index.js";

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synchronized");
  server.listen(config.port, config.host, () => {
    console.log(`Server running on https://${config.host}:${config.port}`);
  });
}).catch((err) => {
  console.error("Failed to sync database:", err);
});

// Handle server errors
server.on("error", (err) => {
  console.error("Server error:", err.message);
});
