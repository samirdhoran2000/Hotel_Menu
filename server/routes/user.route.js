// routes/userRoutes.js
import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/user.controller.js";
import { authenticateHotelToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateHotelToken);

// Public login route
router.post("/login", loginUser);
// CRUD routes for users (protected via auth middleware)
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
