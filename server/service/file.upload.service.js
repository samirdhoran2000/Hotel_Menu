import multer from "multer";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

import multerS3 from "multer-s3";
import path from "path";

// Configure the S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper to check file type
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

// Configure multer-s3 storage
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  // acl: "public-read", // Uncomment if you want public access (and bucket allows it)
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `menu-items/${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (increased for videos if needed)
  },
});
/**
 * Deletes an object from the S3 bucket.
 * @param {string} key - The S3 key of the object to delete.
 */
const deleteFromS3 = async (key) => {
  if (!key) return;
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    await s3.send(new DeleteObjectCommand(params));
    console.log(`Successfully deleted file from S3: ${key}`);
  } catch (error) {
    console.error(`Error deleting file from S3 (${key}):`, error.message);
    // Depending on requirements, you might want to re-throw or just log
  }
};

export { s3, deleteFromS3 };

export default upload;
