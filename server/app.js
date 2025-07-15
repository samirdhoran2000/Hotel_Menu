// src/app.js
import express from "express";
import cors from "cors";
import sequelize from "./models/index.js";
import hotelRoutes from "./routes/hotel.route.js";
// import userRoutes from "./routes/user.route.js";
import menuRoutes from "./routes/menuItem.route.js";
import tableRoutes from "./routes/table.route.js";
import activityRoutes from "./routes/activityLog.route.js";


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
// app.use("/api/user", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/activity-log", activityRoutes);

app.use("/api/public", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("response from server hotel menu")
})

// Sync database
sequelize
  .sync()
  // .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Database sync error:", err));

export default app;
