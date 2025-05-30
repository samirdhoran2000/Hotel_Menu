// src/app.js
import express from "express";
import cors from "cors";
import sequelize from "./models/index.js";
import hotelRoutes from "./routes/hotel.route.js";
import userRoutes from "./routes/user.route.js";


const app = express();

app.use(
  cors({
    origin: "*", // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);
app.use(express.json());


app.use("/api/hotel", hotelRoutes);
app.use("/api/user", userRoutes);

// Sync database
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Database sync error:", err));

export default app;
