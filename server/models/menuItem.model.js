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
      allowNull: true,
      references: {
        model: "hotels",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    // userId: {
    //   type: DataTypes.INTEGER.UNSIGNED,
    //   allowNull: true,
    //   references: {
    //     model: "users",
    //     key: "id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    half_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    full_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    category: {
      type: DataTypes.ENUM(
        "appetizer",
        "biryani",
        "main_course",
        "dessert",
        "beverage",
        "eggs",
        "dal",
        "kofta",
        "papad",
        "noodles",
        "paneer_starter",
        "paneer_ki_mehek",
        "snack",
        "salad",
        "soup",
        "tandoori_starter",
        "veg_starter",
        "veg_speciality",
        "veg_main_course",
        "nonveg_starter",
        "chicken",
        "mutton",
        "fish",
        "roti",
        "rice",
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
    original_half_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    original_full_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    // images: {
    //   // Array of image paths/URLs, e.g. ["./paratha_A.jpeg", "./paratha_B.jpeg"]
    //   type: DataTypes.JSON,
    //   allowNull: true,
    //   // JSON allows storing an array of strings
    // },
    video: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ingredients: {
      // Array of ingredients, e.g. ["Wheat Flour", "Potatoes", …]
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "menu_items",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    // indexes: [{ fields: ['hotel_id'] }, { fields: ['category'] }]
  }
);

export default MenuItem;
