// controllers/menuItemController.js
import { Hotel, MenuItem } from "../models/associations.js";
import { Op } from "sequelize";
import { decodeCode } from "./table.controller.js";
import jwt from 'jsonwebtoken'

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
    const { tableId } = req.query;

    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.query.token || req.body.token;
    
    if (!!token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Hotel.findByPk(decoded.id);
     
      

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Build your where-clause if needed (uncomment / adjust if filtering by hotelId, etc.)
      const whereClause = {};
      if (user?.id) {
        whereClause.hotelId = user?.id;
      }
      // if (search) {
      //   whereClause.name = { [Op.iLike]: `%${search}%` };
      // }
      // if (category) {
      //   whereClause.category = category;
      // }
      // if (minPrice != null && maxPrice != null) {
      //   whereClause.price = { [Op.between]: [minPrice, maxPrice] };
      // } else if (minPrice != null) {
      //   whereClause.price = { [Op.gte]: minPrice };
      // } else if (maxPrice != null) {
      //   whereClause.price = { [Op.lte]: maxPrice };
      // }

      // const offset = (page - 1) * limit;
      const { count, rows } = await MenuItem.findAndCountAll({
        where: whereClause,
        // limit: parseInt(limit, 10),
        // offset: offset,
        // order: [[sortBy, sortOrder.toUpperCase()]],
      });

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
            return `${req.protocol}://${req.get(
              "host"
            )}/api/public/${fileName}`;
          });
        }
        return item;
      });

      return res.status(200).json({
        success: true,
        data: {
          menuItems: processedRows,
          pagination: {
            // currentPage: parseInt(page, 10),
            // totalPages: Math.ceil(count / limit),
            // totalItems: count,
            // itemsPerPage: parseInt(limit, 10),
          },
        },
      });
    }

    console.log("req. user ", req.user);

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

    if (!tableId) {
      return res.status(500).json({
        success: false,
        message: "Table id not found",
        // error: err.message,
      });
    }

    const { hotelId, tableId: tblId } = decodeCode(tableId);
    // const decode = decodeCode(tableId);
    // console.log(decode);

    console.log("id is : ", hotelId, tblId);

    // Build your where-clause if needed (uncomment / adjust if filtering by hotelId, etc.)
    const whereClause = {};
    if (hotelId) {
      whereClause.hotelId = hotelId;
    }
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

    const offset = (page - 1) * limit;
    const { count, rows } = await MenuItem.findAndCountAll({
      where: whereClause,
      // limit: parseInt(limit, 10),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

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

    return res.status(200).json({
      success: true,
      data: {
        menuItems: processedRows,
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
    return res.status(500).json({
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
