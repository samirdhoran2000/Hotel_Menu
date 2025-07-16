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
export function buildImageUrls(items, req) {
  return items.map((item) => {
    // 3) If it's an array of objects, map to URLs
    const itemImgs = JSON.parse(item.images);
    item.ingredients = JSON.parse(item.ingredients);

    if (itemImgs.length > 0) {
      item.images = itemImgs.map((imgObj) => {
        const fileName = imgObj.savedFilename;
        return `${req.protocol}://${req.get("host")}/api/public/${fileName}`;
      });
    }
    return item;
  });
}