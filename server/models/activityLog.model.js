// server/models/activityLog.model.js

import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "tables", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    deviceName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    itemClicked: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "activity_logs",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default ActivityLog;
