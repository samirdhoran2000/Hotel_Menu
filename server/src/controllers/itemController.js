import fs from "fs";
import path from "path";
import Category from "../models/Category.js";
import Item from "../models/Item.js";

const uploadsDir = path.resolve(process.cwd(), "server/uploads");

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

const saveBase64Image = (base64Value) => {
  if (!base64Value || typeof base64Value !== "string" || !base64Value.startsWith("data:image/")) {
    return "";
  }

  ensureUploadsDir();
  const matches = base64Value.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
  if (!matches) {
    return "";
  }

  const extension = matches[1] === "jpeg" ? "jpg" : matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  const fileName = `item-${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${fileName}`;
};

const normalizeItemPayload = async (payload, hotelId) => {
  const category = payload.categoryId
    ? await Category.findOne({ _id: payload.categoryId, hotelId })
    : null;

  let imagePath = payload.image || "";
  if (payload.imageBase64) {
    const savedImage = saveBase64Image(payload.imageBase64);
    if (savedImage) {
      imagePath = savedImage;
    }
  }

  const ingredients = Array.isArray(payload.ingredients)
    ? payload.ingredients
    : String(payload.ingredients || "")
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

  return {
    hotelId,
    name: payload.name?.trim(),
    price: Number(payload.price) || 0,
    originalPrice: Number(payload.originalPrice || payload.price) || 0,
    rating: Number(payload.rating) || 4.2,
    categoryId: category ? String(category._id) : payload.categoryId || "",
    categoryName: category?.name || payload.categoryName || payload.category || "",
    type: payload.type === "nonveg" ? "non-veg" : payload.type || "veg",
    image: imagePath,
    images: imagePath ? [imagePath] : [],
    ingredients,
    description: payload.description?.trim() || "",
    isPopular: Boolean(payload.isPopular),
    isTrending: Boolean(payload.isTrending),
    isAvailable: payload.isAvailable !== false,
  };
};

export const createItem = async (req, res) => {
  try {
    const hotelId = String(req.admin._id);
    if (!req.body.name?.trim()) {
      return res.status(400).json({ message: "Item name is required" });
    }

    const payload = await normalizeItemPayload(req.body, hotelId);
    const item = await Item.create(payload);
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: "Create item failed", error: error.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const hotelId = req.query.hotelId || String(req.admin?._id || "");

    if (!hotelId) {
      return res.status(400).json({ message: "hotelId is required" });
    }

    const items = await Item.find({ hotelId }).sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Fetch items failed", error: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const hotelId = String(req.admin._id);
    const item = await Item.findOne({ _id: req.params.id, hotelId });

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const payload = await normalizeItemPayload({ ...item.toObject(), ...req.body }, hotelId);

    Object.assign(item, payload);
    await item.save();

    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: "Update item failed", error: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const hotelId = String(req.admin._id);
    const item = await Item.findOne({ _id: req.params.id, hotelId });

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (item.image?.startsWith("/uploads/")) {
      const filePath = path.resolve(process.cwd(), `server${item.image}`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await item.deleteOne();
    return res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete item failed", error: error.message });
  }
};
