import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    hotelName: { type: String, required: true, trim: true },
    adminName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    hotelImage: { type: String, default: "" },
    phone: { type: String, default: "" },
    altPhone: { type: String, default: "" },
    address: { type: String, default: "" },
    about: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    publicSlug: { type: String, required: true, unique: true, trim: true, index: true },
    publicBaseUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
