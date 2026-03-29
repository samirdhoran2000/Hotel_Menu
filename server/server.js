// src/index.js
import http from "http";

import app from "./app.js";
import { config } from "./config/config.js";

// HTTPS options


// Create HTTPS server
const server = http.createServer(app);

// Start server
// Import sequelize
import sequelize from "./models/index.js";

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synchronized");
  server.listen(config.port, config.host, () => {
    console.log(`Server running on http://${config.host}:${config.port}`);
  });
}).catch((err) => {
  console.error("Failed to sync database:", err);
});

// Handle server errors
server.on("error", (err) => {
  console.error("Server error:", err.message);
});
