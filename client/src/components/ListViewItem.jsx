// ListViewItem.js
import React, { useState, useEffect, memo } from "react";
import { Heart, Star, Leaf } from "lucide-react";
import MenuItemDialog from "./MenuItemDialog";

const ListViewItem = memo(({ item, isLiked, onLikeToggle }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const ingredientsArray =
    typeof item.ingredients === "string"
      ? JSON.parse(item.ingredients)
      : item.ingredients;

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    onLikeToggle();
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
  const basePrice = item.half_price ? parseFloat(item.half_price) : (parseFloat(item.full_price) || 0);
  const originalPrice = item.half_price ? item.original_half_price : item.original_full_price;
  const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : null;

  return (
    <>
      <div
        className={`
          relative 
          flex items-stretch space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white rounded-xl shadow-md 
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
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0">
          {Array.isArray(item.images) && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              loading="lazy"
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <img
              src="/logo.png"
              loading="lazy"
              alt={item.name}
              className="w-full h-full object-contain rounded-lg p-2 bg-gray-50 border border-gray-100"
            />
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
        <div className="flex-1 flex flex-col justify-between relative z-10 min-w-0">
          <div>
            <div className="flex justify-between items-start mb-1">
              {/* Name + Veg Badge */}
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-words line-clamp-2">
                  {item.name}
                </h3>
                {item.isVegetarian ? (
                  <div className="flex items-center bg-green-100 px-1.5 py-0.5 rounded-full">
                    <Leaf className="w-3 h-3 text-green-600" />
                    <span className="text-[10px] font-medium text-green-800 ml-1">
                      Veg
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center bg-red-100 px-1.5 py-0.5 rounded-full">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 flex-shrink-0" />
                    <span className="text-[10px] font-medium text-red-800 ml-1">
                      Non-Veg
                    </span>
                  </div>
                )}
              </div>

              {/* Rating (if present) */}
              {item.rating !== undefined && item.rating !== null && (
                <div className="flex items-center space-x-1 bg-green-100 px-1.5 py-0.5 rounded-full">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[11px] font-medium text-green-800">
                    {item.rating}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-[13px] sm:text-sm text-gray-600 mb-1.5 line-clamp-2">
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
                Category: {item.category.name}
              </p>
            )}
          </div>

          {/* Price & View Button */}
          <div className="flex justify-between items-end mt-auto pt-2 gap-2">
            <div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                ₹{basePrice.toFixed(2)}
              </span>
              {!isNaN(parsedOriginalPrice) && parsedOriginalPrice !== null && parsedOriginalPrice > 0 && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{parsedOriginalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsDialogOpen(true)}
                className={`
                  px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-300
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
});

export default ListViewItem;
