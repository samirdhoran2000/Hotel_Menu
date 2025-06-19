import express from "express";
const router = express.Router();
import { authenticateHotelToken } from "../middleware/auth.js";
import { getActivitySummaryByHotel } from "../controllers/activityLog.controller.js";

router.use(authenticateHotelToken);

router.get("/", getActivitySummaryByHotel);


export default router;