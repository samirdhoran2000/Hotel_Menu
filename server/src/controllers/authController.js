import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Category from "../models/Category.js";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `hotel-${Date.now()}`;

const createUniqueSlug = async (hotelName) => {
  const baseSlug = slugify(hotelName);
  let slug = baseSlug;
  let counter = 1;

  while (await Admin.findOne({ publicSlug: slug })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

const buildAuthResponse = (admin) => ({
  _id: admin._id,
  hotelId: admin._id,
  hotelName: admin.hotelName,
  adminName: admin.adminName,
  email: admin.email,
  hotelImage: admin.hotelImage,
  phone: admin.phone,
  altPhone: admin.altPhone,
  address: admin.address,
  about: admin.about,
  contactEmail: admin.contactEmail || admin.email,
  publicSlug: admin.publicSlug,
  publicBaseUrl: admin.publicBaseUrl || process.env.PUBLIC_BASE_URL || "",
});

const seedDefaultCategories = async (hotelId) => {
  const defaults = [
    { name: "Starter", sortOrder: 1 },
    { name: "Main Course", sortOrder: 2 },
    { name: "Dessert", sortOrder: 3 },
    { name: "Beverages", sortOrder: 4 },
  ];

  for (const category of defaults) {
    const exists = await Category.findOne({ hotelId, name: category.name });
    if (!exists) {
      await Category.create({ hotelId, ...category });
    }
  }
};

export const signup = async (req, res) => {
  try {
    const { hotelName, adminName, email, password } = req.body;

    if (!hotelName || !adminName || !email || !password) {
      return res.status(400).json({ message: "hotelName, adminName, email, and password are required" });
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const publicSlug = await createUniqueSlug(hotelName);

    const admin = await Admin.create({
      hotelName: hotelName.trim(),
      adminName: adminName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      publicSlug,
      hotelImage: "",
      about: `${hotelName.trim()} welcomes you with freshly prepared food and a warm dining experience.`,
      contactEmail: email.toLowerCase().trim(),
      publicBaseUrl: process.env.PUBLIC_BASE_URL || "",
    });

    await seedDefaultCategories(String(admin._id));

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "Signup successful",
      token,
      admin: buildAuthResponse(admin),
    });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email?.toLowerCase().trim() });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful",
      token,
      admin: buildAuthResponse(admin),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const getMe = async (req, res) => {
  return res.json({ admin: buildAuthResponse(req.admin) });
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    const isMatch = await bcrypt.compare(currentPassword, req.admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    req.admin.password = await bcrypt.hash(newPassword, 10);
    await req.admin.save();

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Password change failed", error: error.message });
  }
};
