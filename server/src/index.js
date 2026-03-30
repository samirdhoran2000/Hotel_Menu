import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import itemRoutes from "./routes/item.js";
import settingsRoutes from "./routes/settings.js";
import publicRoutes from "./routes/public.js";
import Admin from "./models/Admin.js";
import Category from "./models/Category.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = String(process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "server/uploads")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/public", publicRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Category.updateMany(
      { $or: [{ normalizedName: { $exists: false } }, { normalizedName: "" }] },
      [{ $set: { normalizedName: { $toLower: "$name" } } }]
    );
    await Promise.allSettled([Admin.syncIndexes(), Category.syncIndexes()]);
    console.log("MongoDB Connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
