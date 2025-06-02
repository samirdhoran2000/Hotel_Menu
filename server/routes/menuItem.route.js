// routes/menuItemRoutes.js
import express from "express";
import {
  // createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuItem.controller.js";
// import { createMenuItem} from '../service/file.upload.service.js'
import { authenticateUserToken } from "../middleware/auth.js";

const router = express.Router();

// Public route to get all menu items (no authentication required)
router.get("/", getMenuItems);

router.use(authenticateUserToken);

// All routes assume authentication middleware has populated req.user
// router.post("/", createMenuItem);
router.get("/:id", getMenuItemById);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
