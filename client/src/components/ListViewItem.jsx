// ListViewItem.js
import React, { useState, useEffect } from "react";
import { Heart, Star, Leaf } from "lucide-react";
import MenuItemDialog from "./MenuItemDialog";

const ListViewItem = ({ item }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const ingredientsArray =
    typeof item.ingredients === "string"
      ? JSON.parse(item.ingredients)
      : item.ingredients;

  useEffect(() => {
    const likedItems = JSON.parse(localStorage.getItem("likedItems") || "{}");
    setIsLiked(!!likedItems[item.name]);
  }, [item.name]);

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    const likedItems = JSON.parse(localStorage.getItem("likedItems") || "{}");
    if (newLikedState) {
      likedItems[item.name] = true;
    } else {
      delete likedItems[item.name];
    }
    localStorage.setItem("likedItems", JSON.stringify(likedItems));
  };

  // Utility to humanize "main_course" → "Main Course"
  const humanizeCategory = (str) => {
    if (!str) return "";
    return str
      .split("_")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  };

  // Parse prices into numbers for consistency
  const basePrice = parseFloat(item.half_price) || 0;
  const originalPrice = item.original_full_price
    ? parseFloat(item.original_full_price)
    : null;

  return (
    <>
      <div
        className={`
          relative 
          flex items-stretch space-x-4 p-4 bg-white rounded-xl shadow-md 
          transition-all duration-300 hover:shadow-xl 
          ${!item.available ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        {/* If not available, show a "Sold Out" banner */}
        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <span className="text-white text-lg font-semibold">
              Unavailable
            </span>
          </div>
        )}

        {/* Image + Like Button */}
        <div className="relative w-32 h-32 flex-shrink-0">
          {Array.isArray(item.images) && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              loading="lazy"
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}

          <button
            onClick={handleLikeToggle}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md transition-all duration-300 hover:scale-110 z-20"
            disabled={!item.available}
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? "fill-orange-500 text-orange-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex justify-between items-start mb-1">
              {/* Name + Veg Badge */}
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                {item.isVegetarian && (
                  <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-800 ml-1">
                      Veg
                    </span>
                  </div>
                )}
              </div>

              {/* Rating (if present) */}
              {item.rating !== undefined && item.rating !== null && (
                <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-green-800">
                    {item.rating}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {item.description}
            </p>

            {/* Ingredients (up to first 3) */}
            {Array.isArray(ingredientsArray) && ingredientsArray.length > 0 && (
              <div className="text-xs text-gray-500 mb-2">
                <span>Ingredients: </span>
                {ingredientsArray.slice(0, 3).join(", ")}
                {ingredientsArray.length > 3 && "…"}
              </div>
            )}

            {/* Category */}
            {item.category && (
              <p className="text-xs text-gray-500 mb-2">
                Category: {humanizeCategory(item.category)}
              </p>
            )}
          </div>

          {/* Price & View Button */}
          <div className="flex justify-between items-end">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ₹{basePrice.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsDialogOpen(true)}
                className={`
                  px-4 py-2 rounded-lg transition-all duration-300
                  ${
                    item.available
                      ? "bg-black text-white hover:bg-gray-800 active:scale-95"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }
                `}
                disabled={!item.available}
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <MenuItemDialog
        item={item}
        isOpen={isDialogOpen}
        isLiked={isLiked}
        onLikeToggle={handleLikeToggle}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default ListViewItem;
