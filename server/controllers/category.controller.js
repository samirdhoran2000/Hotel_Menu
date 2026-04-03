// server/controllers/category.controller.js
import { Category, MenuItem } from "../models/associations.js";


export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const hotelId = req.user.id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await Category.create({
      name,
      hotelId,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const hotelId = req.user.id;
    const categories = await Category.findAll({
      where: { hotelId },
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const hotelId = req.user.id;

    const category = await Category.findOne({ where: { id, hotelId } });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.update({ name });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = req.user.id;

    const category = await Category.findOne({ where: { id, hotelId } });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if any menu items are associated with this category
    const menuItemsCount = await MenuItem.count({ where: { categoryId: id } });
    if (menuItemsCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category because it is mapped to one or more menu items.",
      });
    }

    await category.destroy();


    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
