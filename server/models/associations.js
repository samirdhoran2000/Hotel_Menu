// server/models/associations.js

import sequelize from "./index.js";
import Hotel from "./hotel.model.js";
import MenuItem from "./menuItem.model.js";
import Table from "./table.model.js";
import ActivityLog from "./activityLog.model.js";

// A hotel has many menu items and tables
Hotel.hasMany(MenuItem, { foreignKey: "hotelId", onDelete: "CASCADE" });
Hotel.hasMany(Table, { foreignKey: "hotelId", onDelete: "CASCADE" });

// A MenuItem belongs to a Hotel
MenuItem.belongsTo(Hotel, { foreignKey: "hotelId" });

// A Table belongs to a Hotel
Table.belongsTo(Hotel, { foreignKey: "hotelId" });

// A Table has many ActivityLogs
Table.hasMany(ActivityLog, { foreignKey: "tableId", onDelete: "CASCADE" });

// An ActivityLog belongs to a Table
ActivityLog.belongsTo(Table, { foreignKey: "tableId", onDelete: "CASCADE" });

// don’t forget to export ActivityLog
export { sequelize, Hotel, MenuItem, Table, ActivityLog };
