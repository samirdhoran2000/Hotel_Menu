import express from "express";
import { createItem, deleteItem, getItems, updateItem } from "../controllers/itemController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getItems);
router.post("/", requireAuth, createItem);
router.put("/:id", requireAuth, updateItem);
router.delete("/:id", requireAuth, deleteItem);

export default router;
