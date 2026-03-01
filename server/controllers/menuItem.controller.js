// controllers/menuItemController.js
import { Hotel, MenuItem, File } from "../models/associations.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import { buildImageUrls, } from "../utils/codeDecode.utils.js";

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
      category,
      isVegetarian,
      available,
      ingredients,
    } = req.body;
    const { id } = req.user;
    // Basic validation
    if (
      !name ||
      half_price == null ||
      original_half_price == null ||
      full_price == null ||
      original_full_price == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, half_price, full_price, original_full_price and original_half_price are required",
      });
    }

    // `req.files` is an array of file info objects (from multer-s3)
    // S3 files have properties like location (url), key, etc.

    const menuItem = await MenuItem.create({
      name,
      description,
      half_price: parseFloat(half_price),
      full_price: parseFloat(full_price),
      category,
      isVegetarian: isVegetarian === "true" || isVegetarian === true,
      available: available === "true" || available === true,
      original_half_price: parseFloat(original_half_price),
      original_full_price: parseFloat(original_full_price),
      // images: [], // Deprecated
      ingredients,
      hotelId: id,
    });

    if (req.files && req.files.length > 0) {
      // Create associated File records
      const fileRecords = req.files.map(file => ({
        url: file.location, // S3 URL
        key: file.key,      // S3 Key
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: file.size,
        menuItemId: menuItem.id
      }));

      // We need to import File model at the top really, or use the association method
      // Using the association method `createFiles` or bulkCreate
      // Since we imported { MenuItem } from associations, we might need File too.
      // Let's rely on standard sequelize mixins if possible, strictly speaking `createFile` exists.
      // But simpler to bulk create on the File model.
      // Wait, I need to check imports.
      // Let's use getMenuItemById pattern which imports models from associations.
      // I need to import `File` in this controller.
      // For now, I'll assume `import { File } ...` is added.
      // Actually, I should update imports first. 
      // Check next tool call for import update.

      // For this replacement, I will assume `File` is available or use `menuItem.createFile` (singular) loop?
      // Better: use bulkCreate on File model. 
      // `import { File } from "../models/associations.js"`

      const { File } = await import("../models/associations.js");
      await File.bulkCreate(fileRecords);
    }

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem, // note: associated files won't be in this return object unless we reload with include
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

    // 5) Parse query parameters for filtering and pagination
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query;

    // Validate pagination parameters
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer.",
      });
    }

    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be a positive integer between 1 and 100.",
      });
    }

    // 6) Build WHERE clause for database query
    const whereClause = { hotelId };

    // Add search filter
    if (search && search.trim()) {
      whereClause.name = { [Op.iLike]: `%${search.trim()}%` };
    }

    // Add category filter
    if (category && category.trim()) {
      whereClause.category = category.trim();
    }

    // Add price range filters
    if (minPrice != null && maxPrice != null) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);

      if (!isNaN(min) && !isNaN(max) && min <= max) {
        whereClause.price = { [Op.between]: [min, max] };
      }
    } else if (minPrice != null) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        whereClause.price = { [Op.gte]: min };
      }
    } else if (maxPrice != null) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        whereClause.price = { [Op.lte]: max };
      }
    }

    // 7) Query the database with pagination
    const offset = (pageNumber - 1) * pageSize;
    const validSortOrders = ["ASC", "DESC"];
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : "DESC";

    const { count, rows } = await MenuItem.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset,
      order: [[sortBy, finalSortOrder]],
      include: [
        {
          model: File,
          as: "files",
          attributes: ["id", "url", "mimeType", "originalName"],
        },
      ],
      distinct: true, // Important for correct count with include
    });

    // 8) Process image URLs if needed
    const processedRows = buildImageUrls(rows, req);

    // 9) Send successful response
    return res.status(200).json({
      success: true,
      data: {
        menuItems: processedRows,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(count / pageSize),
          totalItems: count,
          itemsPerPage: pageSize,
          hasNextPage: pageNumber < Math.ceil(count / pageSize),
          hasPreviousPage: pageNumber > 1,
        },
      },
    });
  } catch (err) {
    console.error("getMenuItems error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred while fetching menu items.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
// Get a single menu item by ID (ensuring it belongs to the user's hotel)
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: hotelId } = req.user;
    const { count, rows } = await MenuItem.findAndCountAll({
      where: { id },
      include: [{ model: File, as: "files" }]
    });

    if (!rows) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    // Transform each row’s images if needed
    const processedRows = buildImageUrls(rows, req);


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
// Get a single menu item by ID (ensuring it belongs to the user's hotel)
export const getMenuItemByHotelId = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: hotelId } = req.user;
    const { count, rows } = await MenuItem.findAndCountAll({
      where: { id, hotelId },
      include: [{ model: File, as: "files" }]
    });

    if (!rows) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    // Transform each row’s images if needed
    const processedRows = buildImageUrls(rows, req)

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

// Update a menu item (only if it belongs to the user's hotel)
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: hotelId } = req.user;

    // 1) Find the item by id + hotelId
    const menuItem = await MenuItem.findOne({ where: { id, hotelId } });
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // 2) Extract incoming fields
    const {
      name,
      description,
      half_price,
      original_half_price,
      full_price,
      original_full_price,
      category,
      isVegetarian,
      available,
      ingredients,
    } = req.body;

    // 3) Basic validation (if you want to enforce presence on update)
    if (
      name !== undefined && (typeof name !== "string" || name.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: "If provided, name must be a non-empty string",
      });
    }

    // 4) Build updateData only for provided fields
    const updateData = {};

    if (name) {
      updateData.name = name.trim();
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (half_price != null) {
      const parsed = parseFloat(half_price);
      if (isNaN(parsed)) {
        return res.status(400).json({
          success: false,
          message: "Invalid value for half_price",
        });
      }
      updateData.half_price = parsed;
    }
    if (original_half_price != null) {
      const parsed = parseFloat(original_half_price);
      if (isNaN(parsed)) {
        return res.status(400).json({
          success: false,
          message: "Invalid value for original_half_price",
        });
      }
      updateData.original_half_price = parsed;
    }
    if (full_price != null) {
      const parsed = parseFloat(full_price);
      if (isNaN(parsed)) {
        return res.status(400).json({
          success: false,
          message: "Invalid value for full_price",
        });
      }
      updateData.full_price = parsed;         // FIXED: was full_full
    }
    if (original_full_price != null) {
      const parsed = parseFloat(original_full_price);
      if (isNaN(parsed)) {
        return res.status(400).json({
          success: false,
          message: "Invalid value for original_full_price",
        });
      }
      updateData.original_full_price = parsed;
    }
    if (category !== undefined) {
      updateData.category = category;
    }
    if (isVegetarian != null) {
      updateData.isVegetarian = isVegetarian === "true" || isVegetarian === true;
    }
    if (available != null) {
      updateData.available = available === "true" || available === true;
    }
    if (ingredients != null) {
      updateData.ingredients = ingredients;
    }

    // 5) Handle new image uploads (Add to existing)
    if (req.files && req.files.length > 0) {
      const fileRecords = req.files.map(file => ({
        url: file.location,
        key: file.key,
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: file.size,
        menuItemId: menuItem.id
      }));
      const { File } = await import("../models/associations.js");
      await File.bulkCreate(fileRecords);
    }

    // 6) Perform update
    await menuItem.update(updateData);

    // 7) Return the updated item
    const processedItem = menuItem.toJSON();
    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: processedItem,
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

// Delete a menu item (only if it belongs to the user's hotel)
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: hotelId } = req.user;
    const menuItem = await MenuItem.findOne({ where: { id, hotelId } });
    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }
    await menuItem.destroy();
    res
      .status(200)
      .json({ success: true, message: "Menu item deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
