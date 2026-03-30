import Category from "../models/Category.js";
import Item from "../models/Item.js";

const normalizeCategoryName = (value = "") => value.trim().toLowerCase();

export const createCategory = async (req, res) => {
  try {
    const { name, description = "", sortOrder = 0 } = req.body;
    const hotelId = String(req.admin._id);

    if (!name?.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const normalizedName = normalizeCategoryName(name);
    const existing = await Category.findOne({ hotelId, normalizedName });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      hotelId,
      name: name.trim(),
      normalizedName,
      description: description.trim(),
      sortOrder: Number(sortOrder) || 0,
    });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: "Create category failed", error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const hotelId = req.query.hotelId || String(req.admin?._id || "");

    if (!hotelId) {
      return res.status(400).json({ message: "hotelId is required" });
    }

    const categories = await Category.find({ hotelId }).sort({ sortOrder: 1, name: 1, createdAt: 1 });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Fetch categories failed", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description = "", sortOrder = 0 } = req.body;
    const hotelId = String(req.admin._id);

    const category = await Category.findOne({ _id: id, hotelId });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!name?.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const normalizedName = normalizeCategoryName(name);
    const duplicate = await Category.findOne({ hotelId, normalizedName, _id: { $ne: id } });
    if (duplicate) {
      return res.status(409).json({ message: "Category name already in use" });
    }

    const oldName = category.name;
    category.name = name.trim();
    category.normalizedName = normalizedName;
    category.description = description.trim();
    category.sortOrder = Number(sortOrder) || 0;
    await category.save();

    if (oldName !== category.name) {
      await Item.updateMany({ hotelId, categoryId: id }, { $set: { categoryName: category.name } });
    }

    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: "Update category failed", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = String(req.admin._id);

    const category = await Category.findOne({ _id: id, hotelId });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const itemCount = await Item.countDocuments({ hotelId, categoryId: id });
    if (itemCount > 0) {
      return res.status(400).json({ message: "Move or delete menu items in this category first" });
    }

    await category.deleteOne();
    return res.json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete category failed", error: error.message });
  }
};
