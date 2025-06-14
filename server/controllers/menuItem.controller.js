// controllers/menuItemController.js
import { Hotel, MenuItem } from "../models/associations.js";
import { Op } from "sequelize";
import { decodeCode } from "./table.controller.js";
import jwt from "jsonwebtoken";

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

// Helper: true if every element in `arr` is a string
function isArrayOfStrings(arr) {
  if (!Array.isArray(arr)) return false;
  return arr.every((el) => typeof el === "string");
}

export const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      isVegetarian,
      available,
      original_price,
      ingredients,
    } = req.body;
    const { id } = req.user;
    console.log("req.user", req.user);

    console.log("Request body:", req.body);

    // Basic validation
    if (!name || price == null || original_price == null) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and original_price are required",
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
    console.log("Uploaded files:", uploadedFiles);

    // If you want to save the full metadata array in your DB:
    const images = uploadedFiles;

    // If instead you only want to store the filenames, do:
    // const images = req.files.map((file) => file.filename);

    const menuItem = await MenuItem.create({
      name,
      description,
      price: parseFloat(price),
      category,
      isVegetarian: isVegetarian === "true" || isVegetarian === true,
      available: available === "true" || available === true,
      original_price: parseFloat(original_price),
      images, // <-- now this is defined
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

// Helper: transform each MenuItem.images into public URLs
function buildImageUrls(items, req) {
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

export const getMenuItems = async (req, res) => {
  try {
    let hotelId = null;

    // 1) Check for auth token in header, body, and query parameters
    const authHeader = req.headers.authorization;
    const tokenFromHeader =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const tokenFromQuery = req.query.token || null;
    const tokenFromBody = req.body.token || null;

    // Priority: Header > Query > Body
    const rawToken = tokenFromHeader || tokenFromQuery || tokenFromBody;

    // 2) If token is present, try to authenticate and get hotel ID
    if (rawToken) {
      try {
        const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
        const hotel = await Hotel.findByPk(decoded.id);

        if (!hotel) {
          return res.status(404).json({
            success: false,
            message: "Hotel not found for this token.",
          });
        }

        hotelId = hotel.id;
        console.log("Hotel ID from token:", hotelId);
      } catch (jwtErr) {
        console.log("JWT verification failed:", jwtErr.message);
        // Don't return error here, fall through to tableId logic
        hotelId = null;
      }
    }

    // 3) If token is absent or invalid, get hotel ID from table ID
    if (!hotelId) {
      const { tableId } = req.query;

      if (!tableId) {
        return res.status(400).json({
          success: false,
          message:
            "Either a valid authentication token or a tableId query parameter is required.",
        });
      }

      // Decode the table ID to extract hotel ID and table ID combination
      let decoded;
      try {
        decoded = decodeCode(tableId);
        console.log("Decoded tableId data:", decoded);
      } catch (decodeErr) {
        console.error("TableId decode error:", decodeErr);
        return res.status(400).json({
          success: false,
          message: "Invalid tableId format. Unable to decode.",
          error: decodeErr.message,
        });
      }

      // Extract hotel ID from decoded table data
      if (!decoded.hotelId) {
        return res.status(400).json({
          success: false,
          message: "Decoded tableId does not contain a valid hotelId.",
        });
      }

      hotelId = decoded.hotelId;
      console.log("Hotel ID from tableId:", hotelId);
    }

    // 4) Validate that we have a hotel ID at this point
    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: "Unable to determine hotel ID from provided authentication.",
      });
    }

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
    const processedRows = rows.map((item) => {
      // If images is not an array of strings, assume array of objects
      if (!isArrayOfStrings(item.images)) {
        // e.g. item.images = [{ filename: "foo.jpg", size: 12345, ... }, …]
        item.images = item.images.map((imgObj) => {
          // replace `filename` with your actual key
          const fileName = imgObj.savedFilename;
          // build your URL however your server is configured:
          // here we assume you have an endpoint like /api/public/:filename
          return `${req.protocol}://${req.get("host")}/api/public/${fileName}`;
        });
      }
      return item;
    });

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
    const processedRows = rows.map((item) => {
      // If images is not an array of strings, assume array of objects
      if (!isArrayOfStrings(item.images)) {
        // e.g. item.images = [{ filename: "foo.jpg", size: 12345, ... }, …]
        item.images = item.images.map((imgObj) => {
          // replace `filename` with your actual key
          const fileName = imgObj.savedFilename;
          // build your URL however your server is configured:
          // here we assume you have an endpoint like /api/public/:filename
          return `${req.protocol}://${req.get("host")}/api/public/${fileName}`;
        });
      }
      return item;
    });

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
      price,
      category,
      isVegetarian,
      available,
      original_price,
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
    if (price != null) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) {
        return res.status(400).json({
          success: false,
          message: "Invalid value for price",
        });
      }
      updateData.price = parsedPrice;
    }
    // If original_price is provided, parse to float
    if (original_price != null) {
      const parsedOrig = parseFloat(original_price);
      if (isNaN(parsedOrig)) {
        return res.status(400).json({
          success: false,
          message: "Invalid value for original_price",
        });
      }
      updateData.original_price = parsedOrig;
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
    await menuItem.update(updateData);

    // 6) After updating, transform the stored `images` (which might be an array of metadata objects)
    //    into publicly‐accessible URLs, exactly as you do in your GET endpoints:
    const processedItem = menuItem.toJSON(); // get plain object
    if (!isArrayOfStrings(processedItem.images)) {
      processedItem.images = processedItem.images.map((imgObj) => {
        const fileName = imgObj.savedFilename;
        return `${req.protocol}://${req.get("host")}/api/public/${fileName}`;
      });
    }

    // 7) Send back the updated item
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
    const { hotelId } = req.user;
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
