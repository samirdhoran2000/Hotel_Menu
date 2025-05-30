// server/models/MenuItem.js

import { DataTypes } from "sequelize";
import sequelize from "./index.js";
const MenuItem = sequelize.define(
    "MenuItem",
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
        references: {
          model: "hotels",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      category: {
        type: DataTypes.ENUM(
          "appetizer",
          "main_course",
          "dessert",
          "beverage",
          "other"
        ),
        allowNull: false,
        defaultValue: "other",
      },
      isVegetarian: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "menu_items",
      underscored:true,
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      // indexes: [{ fields: ['hotelId'] }, { fields: ['category'] }]
    }
  );
export default MenuItem;
