import { promises as fs } from "fs";
import path from "path";

/**
 * Deletes a file at the given relative path under the `uploads` directory.
 *
 * @param {string} relativePath – The file path relative to your base upload folder.
 * @returns {Promise<{ success: boolean; message: string }>}
 */
const deleteImage = async (relativePath) => {
  // 1. Resolve to an absolute path within your uploads directory
  const uploadsDir = path.resolve(process.cwd(), "uploads");
    const fullPath = path.resolve(uploadsDir, relativePath);
    console.log({uploadsDir, fullPath});
    

  // 2. Ensure the resolved path is actually inside the uploads directory
  if (!fullPath.startsWith(uploadsDir + path.sep)) {
    return {
      success: false,
      message: "Invalid file path. Operation not permitted.",
    };
  }

  try {
    // 3. Attempt to delete
    await fs.unlink(fullPath);
    return {
      success: true,
      message: `Successfully deleted file: ${relativePath}`,
    };
  } catch (err) {
    // 4. Handle common errors
    if (err.code === "ENOENT") {
      return {
        success: false,
        message: `File not found: ${relativePath}`,
      };
    }
    if (err.code === "EACCES" || err.code === "EPERM") {
      return {
        success: false,
        message: `Permission denied when deleting file: ${relativePath}`,
      };
    }
    // 5. Fallback for other errors
    console.error("Unexpected error deleting file:", err);
    return {
      success: false,
      message: `Unexpected error deleting file: ${err.message}`,
    };
  }
};

export { deleteImage };
