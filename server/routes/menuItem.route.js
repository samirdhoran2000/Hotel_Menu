// routes/menuItemRoutes.js
import express from "express";
import {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuItem.controller.js";
import upload from '../service/file.upload.service.js'
import { authenticateHotelToken } from "../middleware/auth.js";

const router = express.Router();

// Public route to get all menu items (no authentication required)
router.get("/", getMenuItems);

router.use(authenticateHotelToken);

// All routes assume authentication middleware has populated req.user

// If you truly want **only up to 5** images, change the “10” to “5” here:
router.post("/", upload.array("files", 5), createMenuItem);

// router.post("/", createMenuItem);
router.get("/:id", getMenuItemById);
router.put("/:id", upload.array("files", 5), updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
