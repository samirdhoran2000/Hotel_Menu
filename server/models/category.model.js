// server/models/category.model.js
import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "hotels",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "veg",
      validate: {
        isIn: [["veg", "non-veg"]],
      },
    },
  },
  {
    tableName: "categories",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Category;
