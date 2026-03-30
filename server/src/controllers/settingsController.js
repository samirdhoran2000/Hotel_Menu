import Admin from "../models/Admin.js";

const sanitizeBaseUrl = (value) => {
  const raw = String(value || "").trim();
  return raw.replace(/\/$/, "");
};

const normalizeMapLocation = (payload = {}, fallback = {}) => ({
  lat: Number.isFinite(Number(payload.lat)) ? Number(payload.lat) : fallback?.lat ?? null,
  lng: Number.isFinite(Number(payload.lng)) ? Number(payload.lng) : fallback?.lng ?? null,
  mapUrl: String(payload.mapUrl || fallback?.mapUrl || "").trim(),
  label: String(payload.label || fallback?.label || "").trim(),
});

const buildPublicUrl = (admin) => {
  const baseUrl = sanitizeBaseUrl(admin.publicBaseUrl || process.env.PUBLIC_BASE_URL || "");
  return baseUrl ? `${baseUrl}/?hotel=${admin.publicSlug}` : `/?hotel=${admin.publicSlug}`;
};

const buildSettingsPayload = (admin) => ({
  hotelId: admin._id,
  hotelName: admin.hotelName,
  adminName: admin.adminName,
  email: admin.email,
  role: admin.role || "admin",
  hotelImage: admin.hotelImage,
  phone: admin.phone,
  altPhone: admin.altPhone,
  address: admin.address,
  about: admin.about,
  contactEmail: admin.contactEmail || admin.email,
  mapLocation: normalizeMapLocation(admin.mapLocation),
  publicSlug: admin.publicSlug,
  publicBaseUrl: sanitizeBaseUrl(admin.publicBaseUrl || process.env.PUBLIC_BASE_URL || ""),
  publicUrl: buildPublicUrl(admin),
});

export const getSettings = async (req, res) => {
  return res.json({ settings: buildSettingsPayload(req.admin) });
};

export const updateSettings = async (req, res) => {
  try {
    const admin = req.admin;
    const payload = req.body;

    admin.hotelName = payload.hotelName?.trim() || admin.hotelName;
    admin.adminName = payload.adminName?.trim() || admin.adminName;
    admin.hotelImage = typeof payload.hotelImage === "string" ? payload.hotelImage.trim() : admin.hotelImage;
    admin.phone = typeof payload.phone === "string" ? payload.phone.trim() : admin.phone;
    admin.altPhone = typeof payload.altPhone === "string" ? payload.altPhone.trim() : admin.altPhone;
    admin.address = payload.address?.trim() || "";
    admin.about = payload.about?.trim() || "";
    admin.contactEmail = payload.contactEmail?.trim() || admin.email;
    admin.publicBaseUrl = sanitizeBaseUrl(payload.publicBaseUrl || process.env.PUBLIC_BASE_URL || "");
    admin.mapLocation = normalizeMapLocation(payload.mapLocation, admin.mapLocation);

    await admin.save();

    return res.json({
      message: "Settings updated successfully",
      settings: buildSettingsPayload(admin),
    });
  } catch (error) {
    return res.status(500).json({ message: "Settings update failed", error: error.message });
  }
};

export const regenerateQr = async (req, res) => {
  try {
    const admin = req.admin;
    await Admin.updateOne({ _id: admin._id }, { $set: { publicSlug: admin.publicSlug } });

    return res.json({
      message: "QR link refreshed successfully",
      publicSlug: admin.publicSlug,
      publicUrl: buildPublicUrl(admin),
    });
  } catch (error) {
    return res.status(500).json({ message: "QR regenerate failed", error: error.message });
  }
};
