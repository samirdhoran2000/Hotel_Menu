import express from "express";
import { getPublicHotel } from "../controllers/publicController.js";

const router = express.Router();

router.get("/hotel/:slug", getPublicHotel);

export default router;
