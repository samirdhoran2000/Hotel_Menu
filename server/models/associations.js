// server/models/associations.js

import sequelize from "./index.js";
import Hotel from "./hotel.model.js";
import MenuItem from "./menuItem.model.js";
import Table from "./table.model.js";
// import Order from "./order.model.js";
// import User from "./user.model.js";

// A hotel has many menu items, tables, users
Hotel.hasMany(MenuItem, { foreignKey: "hotelId", onDelete: "CASCADE" });
Hotel.hasMany(Table, { foreignKey: "hotelId", onDelete: "CASCADE" });
// Hotel.hasMany(User, { foreignKey: "hotelId", onDelete: "SET NULL" });

// A MenuItem belongs to a Hotel
MenuItem.belongsTo(Hotel, { foreignKey: "hotelId" });

// A Table belongs to a Hotel
Table.belongsTo(Hotel, { foreignKey: "hotelId" });

// An Order belongs to a Table
// Order.belongsTo(Table, { foreignKey: "tableId" });

// A User belongs to a Hotel
// User.belongsTo(Hotel, { foreignKey: "hotelId" });

// Export all of them
// export { sequelize, Hotel, MenuItem, Table, Order, User };
export { sequelize, Hotel, MenuItem, Table };
