// controllers/menuItemController.js
import {MenuItem} from "../models/associations.js";
import { Op } from "sequelize";

// Helper to standardize error response
export const handleSequelizeError = (err, res) => {
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }
  return res
    .status(500)
    .json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
};

// // Create a new menu item
// export const createMenuItem = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       category,
//       isVegetarian,
//       available,
//       original_price,
//       // images,
//       ingredients,
//     } = req.body;
//       const { id: userId, hotelId } = req.user;
      
//       console.log(" req bocy is ", req.body);
      

//     // Basic validation
//     if (!name || price == null || original_price == null) {
//       return res
//         .status(400)
//         .json({
//           success: false,
//           message: "Name, price, and original_price are required",
//         });
//     }



//     const menuItem = await MenuItem.create({
//       name,
//       description,
//       price,
//       category,
//       isVegetarian,
//       available,
//       original_price,
//       images,
//       ingredients,
//       hotelId,
//       userId,
//     });

//     res
//       .status(201)
//       .json({
//         success: true,
//         message: "Menu item created successfully",
//         data: menuItem,
//       });
//   } catch (err) {
//     console.error("something went wrong in create menu controller ",err);
//     return handleSequelizeError(err, res);
//   }
// };

// Get all menu items for the authenticated user's hotel, with optional filtering
export const getMenuItems = async (req, res) => {
  try {
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
    // const { hotelId } = req.user;
    // const offset = (page - 1) * limit;
    // const whereClause = { hotelId };

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }
    if (category) {
      whereClause.category = category;
    }
    if (minPrice != null && maxPrice != null) {
      whereClause.price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice != null) {
      whereClause.price = { [Op.gte]: minPrice };
    } else if (maxPrice != null) {
      whereClause.price = { [Op.lte]: maxPrice };
    }

    const { count, rows } = await MenuItem.findAndCountAll({
    //   where: whereClause,
      limit: parseInt(limit, 10),
    //   offset: parseInt(offset, 10),
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    res.status(200).json({
      success: true,
      data: {
        menuItems: rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit, 10),
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
  }
};

// Get a single menu item by ID (ensuring it belongs to the user's hotel)
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const { hotelId } = req.user;
    const menuItem = await MenuItem.findOne({ where: { id, hotelId } });
    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }
    res.status(200).json({ success: true, data: menuItem });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
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
    const { hotelId } = req.user;
    const menuItem = await MenuItem.findOne({ where: { id, hotelId } });
    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }
    await menuItem.update(req.body);
    res
      .status(200)
      .json({
        success: true,
        message: "Menu item updated successfully",
        data: menuItem,
      });
  } catch (err) {
    console.error(err);
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
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
  }
};

