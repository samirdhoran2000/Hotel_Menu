import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    hotelId: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    normalizedName: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ hotelId: 1, normalizedName: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
