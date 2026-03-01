export const generateCode = (hotelId, TableId) => {
  const rawString = `${hotelId}:${TableId}`;
  return Buffer.from(rawString).toString("base64");
};

export const decodeCode = (code) => {
  const decoded = Buffer.from(code, "base64").toString("utf-8");
  const [hotelId, tableId] = decoded.split(":");
  return {
    hotelId: hotelId,
    tableId: tableId,
  };
};


// Helper: transform each MenuItem.images into public URLs
// Helper: transform each MenuItem.images into public URLs (or mapped from S3 files)
export function buildImageUrls(items, req) {
  // ensure items is an array
  const list = Array.isArray(items) ? items : [items];

  return list.map((item) => {
    // If we have associated S3 files, use them
    // Note: item might be a Sequelize instance or plain object. 
    // If instance, use item.files. If plain, item.files.
    const files = item.files || (item.AppFiles /* alias check? */); // check association alias

    if (files && Array.isArray(files) && files.length > 0) {
      // Map S3 URLs to `images` property for frontend compatibility
      item.setDataValue ? item.setDataValue('images', files.map(f => f.url)) : (item.images = files.map(f => f.url));
      // Also parse ingredients if it is a string (legacy behavior?)
      if (typeof item.ingredients === 'string') {
        try {
          const parsed = JSON.parse(item.ingredients);
          item.setDataValue ? item.setDataValue('ingredients', parsed) : (item.ingredients = parsed);
        } catch (e) { }
      }
      return item;
    }

    // Legacy logic for local files
    try {
      if (item.images && typeof item.images === 'string') {
        const itemImgs = JSON.parse(item.images);
        if (itemImgs.length > 0) {
          const urls = itemImgs.map((imgObj) => {
            const fileName = imgObj.savedFilename || imgObj; // handle both object and string
            return `${req.protocol}://${req.get("host")}/api/public/${fileName}`;
          });
          item.setDataValue ? item.setDataValue('images', urls) : (item.images = urls);
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    // Parse ingredients if string
    try {
      if (typeof item.ingredients === 'string') {
        const parsed = JSON.parse(item.ingredients);
        item.setDataValue ? item.setDataValue('ingredients', parsed) : (item.ingredients = parsed);
      }
    } catch (e) { }

    return item;
  });
}