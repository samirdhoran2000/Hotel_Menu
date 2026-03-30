import express from "express";
import { getSettings, regenerateQr, updateSettings } from "../controllers/settingsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, getSettings);
router.put("/", requireAuth, updateSettings);
router.post("/regenerate-qr", requireAuth, regenerateQr);

export default router;
