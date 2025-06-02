import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";



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




export default upload;