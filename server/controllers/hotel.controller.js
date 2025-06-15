// server/controllers/hotelController.js

import { Hotel, MenuItem } from "../models/associations.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { decodeCode, buildImageUrls } from "../utils/codeDecode.utils.js";


// Helper to filter out password from responses
const sanitizeHotel = (hotel) => {
  const { password, ...data } = hotel.toJSON();
  return data;
};

// Get all hotels with optional filtering and pagination
export const getAllHotels = async (req, res) => {
  
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Hotel.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    res.status(200).json({
      success: true,
      data: {
        hotels: rows.map(sanitizeHotel),
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit, 10),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get single hotel by ID
export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByPk(id);

    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    res.status(200).json({
      success: true,
      data: sanitizeHotel(hotel),
    });
  } catch (error) {
    console.error("Error fetching hotel:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create new hotel
export const createHotel = async (req, res) => {
  try {
    const {
      name,
      address,
      description,
      website,
      phoneNo,
      email,
      dateOfEstablishment,
      password,
    } = req.body;

    if (!name || !address || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, address and password are required fields",
      });
    }

    const hotel = await Hotel.create({
      name,
      address,
      description,
      website,
      phoneNo,
      email,
      dateOfEstablishment,
      password, // hashed by model hook
    });

    res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: sanitizeHotel(hotel),
    });
  } catch (error) {
    console.error("Error creating hotel:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Hotel with this information already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update hotel by ID
export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const hotel = await Hotel.findByPk(id);
    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });

    // If password is present, model hook will hash it
    await hotel.update(updates);

    res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
      data: sanitizeHotel(hotel),
    });
  } catch (error) {
    console.error("Error updating hotel:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete hotel by ID
export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByPk(id);
    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });

    await hotel.destroy();
    res
      .status(200)
      .json({ success: true, message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Login controller for hotels
export const loginHotel = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const hotel = await Hotel.findOne({ where: { email } });
    if (!hotel) {
      return res
        .status(401)
        .json({ success: false, message: "Hotel Not Found" });
    }

    const valid = await bcrypt.compare(password, hotel.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Password can wrong" });
    }

    const token = jwt.sign(
      { id: hotel.id, email: hotel.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY || "1d",
      }
    );
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getMenuItemsbyHotel = async (req, res) => {
  console.log("function called by table code ");

  try {
    const { tableCode } = req.params;
    const { tableId, hotelId } = decodeCode(tableCode);

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