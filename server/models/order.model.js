// server/models/Order.js

import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tableId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: "tables", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: { min: 0 },
    },
    placedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: false,
    updatedAt: "updatedAt",
  }
);

export default Order;
