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

const normalizeImages = (payload, existingImages = []) => {
  const collected = [];

  if (Array.isArray(payload.images)) {
    payload.images.forEach((value) => {
      if (typeof value === "string" && value.trim()) {
        collected.push(value.trim());
      }
    });
  }

  if (Array.isArray(payload.imageBase64s)) {
    payload.imageBase64s.forEach((value) => {
      const savedImage = saveBase64Image(value);
      if (savedImage) {
        collected.push(savedImage);
      }
    });
  }

  if (payload.imageBase64) {
    const savedImage = saveBase64Image(payload.imageBase64);
    if (savedImage) {
      collected.unshift(savedImage);
    }
  }

  if (payload.image && typeof payload.image === "string" && payload.image.trim()) {
    collected.unshift(payload.image.trim());
  }

  const finalImages = [...collected.filter(Boolean)];

  if (!finalImages.length && Array.isArray(existingImages) && existingImages.length) {
    return existingImages.slice(0, 4);
  }

  return [...new Set(finalImages)].slice(0, 4);
};

const normalizeItemPayload = async (payload, hotelId, existingItem = null) => {
  const category = payload.categoryId
    ? await Category.findOne({ _id: payload.categoryId, hotelId })
    : null;

  const ingredients = Array.isArray(payload.ingredients)
    ? payload.ingredients
    : String(payload.ingredients || "")
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

  const images = normalizeImages(payload, existingItem?.images || []);
  const primaryImage = images[0] || "";

  return {
    hotelId,
    name: payload.name?.trim(),
    price: Number(payload.price) || 0,
    originalPrice: Number(payload.originalPrice || payload.price) || 0,
    rating: Number(payload.rating) || 4.2,
    categoryId: category ? String(category._id) : payload.categoryId || "",
    categoryName: category?.name || payload.categoryName || payload.category || "",
    type: payload.type === "nonveg" ? "non-veg" : payload.type || "veg",
    image: primaryImage,
    images,
    ingredients,
    description: payload.description?.trim() || "",
    isPopular: Boolean(payload.isPopular),
    isTrending: Boolean(payload.isTrending),
    isAvailable: payload.isAvailable !== false,
  };
};

const cleanupUploadedImages = (images = []) => {
  images.forEach((imagePath) => {
    if (typeof imagePath === "string" && imagePath.startsWith("/uploads/")) {
      const filePath = path.resolve(process.cwd(), `server${imagePath}`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  });
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

    const oldImages = Array.isArray(item.images) ? [...item.images] : [];
    const payload = await normalizeItemPayload({ ...item.toObject(), ...req.body }, hotelId, item);

    Object.assign(item, payload);
    await item.save();

    const removedImages = oldImages.filter((imagePath) => !payload.images.includes(imagePath));
    cleanupUploadedImages(removedImages);

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

    cleanupUploadedImages(item.images?.length ? item.images : [item.image]);

    await item.deleteOne();
    return res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete item failed", error: error.message });
  }
};
