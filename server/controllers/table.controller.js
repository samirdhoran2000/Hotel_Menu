// controllers/tableController.js

import { config } from "../config/config.js";
import { Table } from "../models/associations.js";

export const generateCode = (hotelId, TableId) => {
  const rawString = `${hotelId}:${TableId}`;
  return Buffer.from(rawString).toString("base64");
};

export const decodeCode = (code) => {
  const decoded = Buffer.from(code, "base64").toString("utf-8");
  const [hotelId, tableId] = decoded.split(":");
  return {
    hotelId: hotelId,
    tableId: tableId,
  };
};

// Create a new table
export const createTable = async (req, res) => {
  try {
    const { tableNumber } = req.body;
    const { id: hotelId } = req.user; // Assuming userId is available in req.user

    // Validate required fields
    if (!hotelId || !tableNumber) {
      return res
        .status(400)
        .json({ message: "hotelId, tableNumber are required." });
    }

    const newTable = await Table.create({
      hotelId,
      tableNumber,
      qrCodeLink: `${config.domain}/${generateCode(hotelId, tableNumber)}`,
    });

    return res.status(201).json(newTable);
  } catch (error) {
    console.error("Error creating table:", error);
    // Handle unique constraint / validation errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "qrCodeLink must be unique." });
    }
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message).join(", ") });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get all tables (optionally filter by hotelId)
export const getAllTables = async (req, res) => {
  try {
    // const { hotelId } = req.query;
    // const whereClause = hotelId ? { hotelId } : {};
    const { id } = req.user;
    console.log("get all table ", { id });

    const tables = await Table.findAll({
      where: { hotelId: id },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get a single table by its ID
export const getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findByPk(id);

    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }

    return res.status(200).json(table);
  } catch (error) {
    console.error("Error fetching table:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Update an existing table
export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { hotelId, tableNumber, qrCodeLink } = req.body;

    const table = await Table.findByPk(id);
    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }

    // Only update provided fields
    if (hotelId !== undefined) table.hotelId = hotelId;
    if (tableNumber !== undefined) table.tableNumber = tableNumber;
    if (qrCodeLink !== undefined) table.qrCodeLink = qrCodeLink;

    await table.save();
    return res.status(200).json(table);
  } catch (error) {
    console.error("Error updating table:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "qrCodeLink must be unique." });
    }
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message).join(", ") });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a table by its ID
export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findByPk(id);

    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }

    await table.destroy();
    return res.status(200).json({ message: "Table deleted successfully." });
  } catch (error) {
    console.error("Error deleting table:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
