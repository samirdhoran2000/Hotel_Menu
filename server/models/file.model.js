
import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const File = sequelize.define(
    "File",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        url: {
            type: DataTypes.STRING(2048), // URLs can be long
            allowNull: false,
        },
        key: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        mimeType: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        originalName: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        // We will associate this with MenuItem in associations.js
    },
    {
        tableName: "files",
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

export default File;
