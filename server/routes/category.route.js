// server/routes/category.route.js
import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getPublicCategories,
} from "../controllers/category.controller.js";
import { authenticateHotelToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/public/:tableCode", getPublicCategories);

router.use(authenticateHotelToken);

router.post("/", createCategory);
router.get("/", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
