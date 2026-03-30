import Admin from "../models/Admin.js";

const sanitizeBaseUrl = (value) => {
  const raw = String(value || "").trim();
  return raw.replace(/\/$/, "");
};

const buildPublicUrl = (admin) => {
  const baseUrl = sanitizeBaseUrl(admin.publicBaseUrl || process.env.PUBLIC_BASE_URL || "");
  return baseUrl ? `${baseUrl}/?hotel=${admin.publicSlug}` : `/?hotel=${admin.publicSlug}`;
};

export const getSettings = async (req, res) => {
  const admin = req.admin;
  return res.json({
    settings: {
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
      publicBaseUrl: sanitizeBaseUrl(admin.publicBaseUrl || process.env.PUBLIC_BASE_URL || ""),
      publicUrl: buildPublicUrl(admin),
    },
  });
};

export const updateSettings = async (req, res) => {
  try {
    const admin = req.admin;
    const payload = req.body;

    admin.hotelName = payload.hotelName?.trim() || admin.hotelName;
    admin.adminName = payload.adminName?.trim() || admin.adminName;
    admin.phone = payload.phone?.trim() || "";
    admin.altPhone = payload.altPhone?.trim() || "";
    admin.address = payload.address?.trim() || "";
    admin.about = payload.about?.trim() || "";
    admin.contactEmail = payload.contactEmail?.trim() || admin.email;
    admin.publicBaseUrl = sanitizeBaseUrl(payload.publicBaseUrl || process.env.PUBLIC_BASE_URL || "");

    await admin.save();

    return res.json({
      message: "Settings updated successfully",
      settings: {
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
        publicBaseUrl: sanitizeBaseUrl(admin.publicBaseUrl || process.env.PUBLIC_BASE_URL || ""),
        publicUrl: buildPublicUrl(admin),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Settings update failed", error: error.message });
  }
};

export const regenerateQr = async (req, res) => {
  try {
    const admin = req.admin;
    const base = admin.hotelName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "hotel";

    admin.publicSlug = `${base}-${Date.now().toString().slice(-6)}`;
    await admin.save();

    return res.json({
      message: "QR link regenerated successfully",
      publicSlug: admin.publicSlug,
      publicUrl: buildPublicUrl(admin),
    });
  } catch (error) {
    return res.status(500).json({ message: "QR regenerate failed", error: error.message });
  }
};
