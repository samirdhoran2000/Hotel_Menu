import express from "express";
import multer from "multer";
// import ftp from "basic-ftp";
import path from "path";
import fs from "fs";
// Removed url package import - no longer needed
// Adjust these imports to point at your actual files:
import { MenuItem } from "../models/associations.js";
// import { handleSequelizeError } from "../controllers/menuItem.controller.js";

import { fileURLToPath } from "url";
import { authenticateHotelToken, authenticateUserToken } from "../middleware/auth.js";

const router = express.Router();

// __filename and __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Ensure the “uploads” folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 2. Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save all uploads under “/uploads”
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    // e.g. “1617891234567_images.png”
    cb(null, `${timestamp}_${file.fieldname}${ext}`);
  },
});

// 3. File filter: accept only image MIME types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

// 4. Create the Multer upload middleware (max 5 images, each ≤ 5MB)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter,
});

const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      isVegetarian,
      available,
      original_price,
      ingredients,
    } = req.body;
    const { id: userId, hotelId } = req.user;

    console.log("Request body:", req.body);

    // Basic validation
    if (!name || price == null || original_price == null) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and original_price are required",
      });
    }

    // `req.files` is an array of file info objects if at least one file was uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images were uploaded." });
    }

    // Build an array of metadata for each uploaded file
    const uploadedFiles = req.files.map((file) => ({
      originalName: file.originalname,
      savedFilename: file.filename,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      destinationPath: file.path,
    }));
    console.log("Uploaded files:", uploadedFiles);

    // If you want to save the full metadata array in your DB:
    const images = uploadedFiles;

    // If instead you only want to store the filenames, do:
    // const images = req.files.map((file) => file.filename);

    const menuItem = await MenuItem.create({
      name,
      description,
      price: parseFloat(price),
      category,
      isVegetarian: isVegetarian === "true" || isVegetarian === true,
      available: available === "true" || available === true,
      original_price: parseFloat(original_price),
      images, // <-- now this is defined
      ingredients,
      hotelId,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// If you truly want **only up to 5** images, change the “10” to “5” here:
router.post("/", authenticateHotelToken, upload.array("files", 5), createMenuItem);

export default router;