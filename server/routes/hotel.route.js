// server/routes/hotel.route.js

import express from "express";
import {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,loginHotel,getMenuItemsbyHotel
  // searchHotels,
} from "../controllers/hotel.controller.js";
import { authenticateHotelToken } from "../middleware/auth.js";


const router = express.Router();

// POST /api/hotels - Create new hotel
router.post("/", createHotel);
router.post("/login", loginHotel);

router.get("/:tableCode", getMenuItemsbyHotel);

router.use(authenticateHotelToken);

// GET /api/hotels - Get all hotels with optional pagination and filtering
router.get("/", getAllHotels);

// GET /api/hotels/search - Search hotels by specific criteria
// router.get("/search", searchHotels);

// GET /api/hotels/:id - Get single hotel by ID
router.get("/:id", getHotelById);

// PUT /api/hotels/:id - Update hotel by ID
router.put("/:id", updateHotel);

// DELETE /api/hotels/:id - Delete hotel by ID
router.delete("/:id", deleteHotel);

export default router;
