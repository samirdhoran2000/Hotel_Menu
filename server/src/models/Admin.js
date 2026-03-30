import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    hotelName: { type: String, required: true, trim: true },
    adminName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin", trim: true },
    hotelImage: { type: String, default: "" },
    phone: { type: String, default: "", trim: true },
    altPhone: { type: String, default: "", trim: true },
    address: { type: String, default: "" },
    about: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    mapLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      mapUrl: { type: String, default: "" },
      label: { type: String, default: "" },
    },
    publicSlug: { type: String, required: true, unique: true, trim: true, index: true },
    publicBaseUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

adminSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $type: "string", $gt: "" },
    },
  }
);

export default mongoose.model("Admin", adminSchema);
