import Admin from "../models/Admin.js";
import Category from "../models/Category.js";
import Item from "../models/Item.js";

export const getPublicHotel = async (req, res) => {
  try {
    const { slug } = req.params;
    const admin = await Admin.findOne({ publicSlug: slug });

    if (!admin) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const hotelId = String(admin._id);
    const [categories, items] = await Promise.all([
      Category.find({ hotelId }).sort({ sortOrder: 1, name: 1 }),
      Item.find({ hotelId, isAvailable: true }).sort({ createdAt: -1 }),
    ]);

    return res.json({
      hotel: {
        hotelId,
        hotelName: admin.hotelName,
        adminName: admin.adminName,
        hotelImage: admin.hotelImage,
        phone: admin.phone,
        altPhone: admin.altPhone,
        address: admin.address,
        about: admin.about,
        contactEmail: admin.contactEmail || admin.email,
        publicSlug: admin.publicSlug,
      },
      categories,
      items,
    });
  } catch (error) {
    return res.status(500).json({ message: "Public hotel fetch failed", error: error.message });
  }
};
