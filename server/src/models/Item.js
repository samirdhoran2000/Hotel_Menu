import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    hotelId: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, default: 0 },
    originalPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 4.2 },
    categoryId: { type: String, default: "" },
    categoryName: { type: String, default: "" },
    type: { type: String, enum: ["veg", "non-veg", "nonveg"], default: "veg" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    ingredients: { type: [String], default: [] },
    description: { type: String, default: "" },
    isPopular: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
