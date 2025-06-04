// routes/tableRoutes.js

import express from "express";
import {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable,
} from "../controllers/table.controller.js";
import { authenticateHotelToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateHotelToken)

// POST   /tables          → create a new table
router.post("/", createTable);

// GET    /tables          → get all tables (optionally filter by ?hotelId=)
router.get("/", getAllTables);

// GET    /tables/:id      → get a single table by ID
router.get("/:id", getTableById);

// PUT    /tables/:id      → update a table
router.put("/:id", updateTable);

// DELETE /tables/:id      → delete a table
router.delete("/:id", deleteTable);

export default router;
