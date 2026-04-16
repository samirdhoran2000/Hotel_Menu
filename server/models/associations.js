// server/models/associations.js

import sequelize from "./index.js";
import Hotel from "./hotel.model.js";
import MenuItem from "./menuItem.model.js";
import Table from "./table.model.js";


import Category from "./category.model.js";
import File from "./file.model.js";

// A hotel has many menu items, tables and categories
Hotel.hasMany(MenuItem, { foreignKey: "hotelId", onDelete: "CASCADE" });
Hotel.hasMany(Table, { foreignKey: "hotelId", onDelete: "CASCADE" });
Hotel.hasMany(Category, { foreignKey: "hotelId", onDelete: "CASCADE" });

// A MenuItem belongs to a Hotel
MenuItem.belongsTo(Hotel, { foreignKey: "hotelId" });

// A MenuItem belongs to a Category
MenuItem.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(MenuItem, { foreignKey: "categoryId" });

// A Category belongs to a Hotel
Category.belongsTo(Hotel, { foreignKey: "hotelId" });

// A MenuItem has many Files (images)
MenuItem.hasMany(File, { foreignKey: "menuItemId", as: "files", onDelete: "CASCADE" });
File.belongsTo(MenuItem, { foreignKey: "menuItemId" });

// A Table belongs to a Hotel
Table.belongsTo(Hotel, { foreignKey: "hotelId" });

export { sequelize, Hotel, MenuItem, Table, File, Category };
