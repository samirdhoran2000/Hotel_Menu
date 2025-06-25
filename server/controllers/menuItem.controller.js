// controllers/menuItemController.js
import { Hotel, MenuItem } from "../models/associations.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import {  buildImageUrls,  } from "../utils/codeDecode.utils.js";

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

    // `req.files` is an array of file info objects if at least one file was uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images were uploaded." });
    }

    // Build an array of metadata for each uploaded file
    const uploadedFiles = req.files.map((file) => ({
      originalName: file.originalname,
      savedFilename: file.filename,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      destinationPath: file.path,
    }));
   

    // If you want to save the full metadata array in your DB:
    const images = uploadedFiles;

    // If instead you only want to store the filenames, do:
    // const images = req.files.map((file) => file.filename);

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
      images, 
      ingredients,
      hotelId: id,
      // userId,
    });

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
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
    const { count, rows } = await MenuItem.findAndCountAll({ where: { id } });

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

    // 1) Find the item by id + hotelId (so user can only update items in their own hotel)
    const menuItem = await MenuItem.findOne({
      where: { id, hotelId },
    });
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // 2) Extract incoming fields from req.body
    //    Only update those fields if they are provided:
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

    // 3) Build an updateData object that includes only the fields that exist in the request
    const updateData = {};

    // If the client sent a new name, update it
    if (typeof name === "string" && name.trim().length > 0) {
      updateData.name = name.trim();
    }
    // Description can be an empty string, but if it's provided, update
    if (typeof description === "string") {
      updateData.description = description;
    }
    // If price is provided (could be "0"), parse it to float
    if (half_price != null) {
      const parsedHalfPrice = parseFloat(half_price);
      if (isNaN(parsedHalfPrice)) {
        return res.status(400).json({
          success: false,
          message: "Invalid value for half price",
        });
      }
      updateData.half_price = parsedHalfPrice;
    }
    // If price is provided (could be "0"), parse it to float
    if (full_price != null) {
      const parsedFullPrice = parseFloat(full_price);
      if (isNaN(parsedFullPrice)) {
        return res.status(400).json({
          success: false,
          message: "Invalid value for full price",
        });
      }
      updateData.full_full = parsedFullPrice;
    }
    // If original_half_price is provided, parse to float
    if (original_half_price != null) {
      const parsedOriginalHalfPrice = parseFloat(original_half_price);
      if (isNaN(parsedOriginalHalfPrice)) {
        return res.status(400).json({
          success: false,
          message: "Invalid value for original half price",
        });
      }
      updateData.original_half_price = parsedOriginalHalfPrice;
    }
    // Category
    if (typeof category === "string") {
      updateData.category = category;
    }
    // Boolean fields: they might come in as strings ("true"/"false") or booleans
    if (isVegetarian != null) {
      updateData.isVegetarian =
        isVegetarian === "true" || isVegetarian === true;
    }
    if (available != null) {
      updateData.available = available === "true" || available === true;
    }
    // Ingredients (array of strings, or whatever shape you expect)
    if (ingredients != null) {
      updateData.ingredients = ingredients;
    }

    // 4) Handle file uploads exactly like in createMenuItem:
    //    If req.files exists and has length > 0, build a new images array
    if (req.files && req.files.length > 0) {
      const uploadedFiles = req.files.map((file) => ({
        originalName: file.originalname,
        savedFilename: file.filename,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        destinationPath: file.path,
      }));
      // Replace the entire images field with the newly uploaded set:
      updateData.images = uploadedFiles;
    }

    // 5) Perform the update (only on the keys we put into updateData)
    const result = await menuItem.update(updateData);
    if (!result) {
      throw new Error("something went wrong while updating menu")
    }

    // 6) After updating, transform the stored `images` (which might be an array of metadata objects)
    //    into publicly‐accessible URLs, exactly as you do in your GET endpoints:
    const processedItem = menuItem.toJSON(); // get plain object

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: processedItem,
    });
  } catch (err) {
    console.error("Error updating menu item:", err);
    return handleSequelizeError(err, res);
  }
};

// Delete a menu item (only if it belongs to the user's hotel)
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { id:hotelId } = req.user;
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
