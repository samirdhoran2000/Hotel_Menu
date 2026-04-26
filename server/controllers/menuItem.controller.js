// controllers/menuItemController.js
import { Hotel, MenuItem, File, Category } from "../models/associations.js";
import { Op } from "sequelize";
import { buildImageUrls } from "../utils/codeDecode.utils.js";
import { s3, deleteFromS3 } from "../service/file.upload.service.js";


// Helper to standardize error response
export const handleSequelizeError = (err, res) => {
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
};

export const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      half_price,
      original_half_price,
      full_price,
      original_full_price,
      categoryId,
      isVegetarian,
      available,
      ingredients,
    } = req.body;
    const { id: hotelId } = req.user;

    // Basic validation
    if (
      !name ||
      full_price == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Name and full price are required",
      });
    }

    const parsedHalfPrice = half_price ? parseFloat(half_price) : null;
    const parsedOriginalHalfPrice = original_half_price ? parseFloat(original_half_price) : null;
    const parsedOriginalFullPrice = original_full_price ? parseFloat(original_full_price) : null;

    const menuItem = await MenuItem.create({
      name,
      description,
      half_price: parsedHalfPrice,
      full_price: parseFloat(full_price),
      categoryId: categoryId ? parseInt(categoryId, 10) : null,
      isVegetarian: isVegetarian == null ? true : (isVegetarian === "true" || isVegetarian === true),
      available: available === "true" || available === true,
      original_half_price: parsedOriginalHalfPrice,
      original_full_price: parsedOriginalFullPrice,
      ingredients: typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients,
      hotelId,
    });

    if (req.files && req.files.length > 0) {
      const fileRecords = req.files.map(file => ({
        url: file.location, // S3 URL
        key: file.key,      // S3 Key
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: file.size,
        menuItemId: menuItem.id
      }));

      await File.bulkCreate(fileRecords);
    }

    // Reload to include category and files
    const result = await MenuItem.findByPk(menuItem.id, {
      include: [
        { model: Category, as: "category" },
        { model: File, as: "files" }
      ]
    });

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getMenuItems = async (req, res) => {
  try {
    const { id: hotelId } = req.user;

    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({ success: false, message: "Page must be a positive integer." });
    }

    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
      return res.status(400).json({ success: false, message: "Limit must be between 1 and 100." });
    }

    const whereClause = { hotelId };

    if (search && search.trim()) {
      whereClause.name = { [Op.iLike]: `%${search.trim()}%` };
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (minPrice != null || maxPrice != null) {
      whereClause.full_price = {};
      if (minPrice != null) whereClause.full_price[Op.gte] = parseFloat(minPrice);
      if (maxPrice != null) whereClause.full_price[Op.lte] = parseFloat(maxPrice);
    }

    const offset = (pageNumber - 1) * pageSize;
    const finalSortOrder = ["ASC", "DESC"].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : "DESC";

    const { count, rows } = await MenuItem.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset,
      order: [[sortBy, finalSortOrder]],
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: File, as: "files", attributes: ["id", "url", "mimeType", "originalName"] },
      ],
      distinct: true,
    });

    const processedRows = buildImageUrls(rows, req);

    return res.status(200).json({
      success: true,
      data: {
        menuItems: processedRows,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(count / pageSize),
          totalItems: count,
          itemsPerPage: pageSize,
          hasNextPage: rows.length === pageSize && pageNumber < Math.ceil(count / pageSize),
          hasPreviousPage: pageNumber > 1,
        },
      },
    });
  } catch (err) {
    console.error("getMenuItems error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred while fetching menu items.",
      error: err.message,
    });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = req.user.id; // Optional: restrict to hotelId if needed

    const menuItem = await MenuItem.findOne({
      where: { id },
      include: [
        { model: Category, as: "category" },
        { model: File, as: "files" }
      ]
    });

    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    const processedRows = buildImageUrls([menuItem], req);

    res.status(200).json({ success: true, data: processedRows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getMenuItemByHotelId = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: hotelId } = req.user;

    const menuItem = await MenuItem.findOne({
      where: { id, hotelId },
      include: [
        { model: Category, as: "category" },
        { model: File, as: "files" }
      ]
    });

    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    const processedRows = buildImageUrls([menuItem], req);

    res.status(200).json({ success: true, data: processedRows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: hotelId } = req.user;

    const menuItem = await MenuItem.findOne({ where: { id, hotelId } });
    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    const {
      name,
      description,
      half_price,
      original_half_price,
      full_price,
      original_full_price,
      categoryId,
      isVegetarian,
      available,
      ingredients,
      keepImageIds // Now passing IDs instead of URLs
    } = req.body;


    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;
    if (half_price !== undefined) updateData.half_price = half_price ? parseFloat(half_price) : null;
    if (original_half_price !== undefined) updateData.original_half_price = original_half_price ? parseFloat(original_half_price) : null;
    if (full_price != null) updateData.full_price = parseFloat(full_price);
    if (original_full_price !== undefined) updateData.original_full_price = original_full_price ? parseFloat(original_full_price) : null;
    if (categoryId !== undefined) updateData.categoryId = categoryId ? parseInt(categoryId, 10) : null;
    if (isVegetarian != null) updateData.isVegetarian = isVegetarian === "true" || isVegetarian === true;
    if (available != null) updateData.available = available === "true" || available === true;
    if (ingredients != null) updateData.ingredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;

    // --- File Synchronization ---
    // 1. Identify files to delete by ID
    if (keepImageIds !== undefined) {
      const keepIds = Array.isArray(keepImageIds) ? keepImageIds : JSON.parse(keepImageIds);
      
      const filesToDelete = await File.findAll({
        where: {
          menuItemId: id,
          id: { [Op.notIn]: keepIds }
        }
      });

      for (const file of filesToDelete) {
        // Delete from S3 using the centralized service
        await deleteFromS3(file.key);
        // Delete from DB
        await file.destroy();
      }
    }


    // 2. Handle new uploads
    if (req.files && req.files.length > 0) {
      const fileRecords = req.files.map(file => ({
        url: file.location,
        key: file.key,
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: file.size,
        menuItemId: menuItem.id
      }));
      await File.bulkCreate(fileRecords);
    }

    await menuItem.update(updateData);

    const result = await MenuItem.findByPk(id, {
      include: [
        { model: Category, as: "category" },
        { model: File, as: "files" }
      ]
    });

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating menu item:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: hotelId } = req.user;

    const menuItem = await MenuItem.findOne({ where: { id, hotelId }, include: [{ model: File, as: "files" }] });
    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    // Delete all associated files from S3
    for (const file of menuItem.files) {
      await deleteFromS3(file.key);
    }


    await menuItem.destroy(); // Files will be deleted by CASCADE in DB
    
    res.status(200).json({ success: true, message: "Menu item deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
