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
// Helper: true if every element in `arr` is a string
export function isArrayOfStrings(arr) {
  if (!Array.isArray(arr)) return false;
  return arr.every((el) => typeof el === "string");
}



// Helper: transform each MenuItem.images into public URLs
export function buildImageUrls(items, req) {
  return items.map((item) => {
    if (!isArrayOfStrings(item.images)) {
      item.images = item.images.map((imgObj) => {
        const fileName = imgObj.savedFilename;
        return `${req.protocol}://${req.get("host")}/api/public/${fileName}`;
      });
    }
    return item;
  });
}