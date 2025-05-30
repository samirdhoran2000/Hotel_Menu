// server/models/Hotel.js

import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import bcrypt from "bcryptjs";

const Hotel = sequelize.define(
  "Hotel",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    phoneNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[0-9\-\+\s\(\)]+$/i,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    dateOfEstablishment: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "hotels",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    hooks: {
      // Hash password before creating or updating
      beforeCreate: async (hotel) => {
        if (hotel.password) {
          const salt = await bcrypt.genSalt(10);
          hotel.password = await bcrypt.hash(hotel.password, salt);
        }
      },
      beforeUpdate: async (hotel) => {
        if (hotel.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          hotel.password = await bcrypt.hash(hotel.password, salt);
        }
      },
    },
  }
);

// Instance method to validate password
Hotel.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default Hotel;
