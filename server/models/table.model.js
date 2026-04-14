// server/models/Table.js

import { DataTypes } from "sequelize";
import sequelize from "./index.js";


const Table = sequelize.define(
  "Table",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "hotels", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    tableNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    qrCodeLink: {
      type: DataTypes.STRING(512),
      allowNull: true,
      // unique: true,
      // validate: { isUrl: true },
    },
   active: {
     type: DataTypes.BOOLEAN,
     allowNull: false,
     defaultValue:true
    },
  },
  {
    tableName: "tables",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default Table;