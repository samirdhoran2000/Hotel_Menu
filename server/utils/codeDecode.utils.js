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
    // 1) Handle Sequelize instance vs plain object
    const itemData = item.get ? item.get({ plain: true }) : item;

    // 2) Collect S3 Images if 'files' association exists
    const files = itemData.files || [];
    if (Array.isArray(files) && files.length > 0) {
      itemData.images = files.map((f) => f.url);
    } else {
      // Legacy logic for local files stored in 'images' JSON column
      try {
        if (itemData.images && typeof itemData.images === "string") {
          const itemImgs = JSON.parse(itemData.images);
          if (Array.isArray(itemImgs) && itemImgs.length > 0) {
            itemData.images = itemImgs.map((imgObj) => {
              const fileName = imgObj.savedFilename || imgObj;
              return `${req.protocol}://${req.get("host")}/api/public/${fileName}`;
            });
          } else {
            itemData.images = [];
          }
        } else if (!itemData.images) {
          itemData.images = [];
        }
      } catch (e) {
        itemData.images = [];
      }
    }

    // 3) Parse ingredients if it's a string
    if (typeof itemData.ingredients === "string") {
      try {
        itemData.ingredients = JSON.parse(itemData.ingredients);
      } catch (e) {
        itemData.ingredients = []; // fallback to empty array
      }
    } else if (!itemData.ingredients) {
      itemData.ingredients = [];
    }

    return itemData;
  });
}