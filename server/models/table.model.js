// server/models/Table.js

import { DataTypes } from "sequelize";
import sequelize from "./index.js";


const Table = sequelize.define(
  "Table",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    hotelId: {
      type: DataTypes.INTEGER.UNSIGNED,
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
      allowNull: false,
      unique: true,
      validate: { isUrl: true },
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