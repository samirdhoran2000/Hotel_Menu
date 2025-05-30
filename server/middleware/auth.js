// src/middleware/auth.js
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import {Hotel} from "../models/associations.js";

export const authenticateHotelToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hotel = await Hotel.findByPk(decoded.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    req.hotel = hotel;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};


