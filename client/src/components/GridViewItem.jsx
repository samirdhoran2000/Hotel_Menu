// GridViewItem.js
import React, { useState, memo } from "react";
import { Heart, Star, Leaf } from "lucide-react"; // Added a Leaf icon for Veg badge
import MenuItemDialog from "./MenuItemDialog";

const GridViewItem = memo(({ item, isLiked, onLikeToggle }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    onLikeToggle();
  };

  // Utility to turn "main_course" → "Main Course"
  const humanizeCategory = (str) => {
    if (!str) return "";
    return str
      .split("_")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <>
      <div
        className={`
          relative 
          bg-white 
          rounded-xl 
          shadow-md 
          overflow-hidden 
          transition-all duration-300 
          hover:shadow-xl
          ${!item.available ? "opacity-50 pointer-events-none" : ""}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image + Like button */}
        <div className="relative aspect-square">
          {Array.isArray(item.images) && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              loading="lazy"
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />
          ) : (
            <img
              src="/logo.png"
              loading="lazy"
              alt={item.name}
              className="w-full h-full object-contain p-4 bg-gray-50 transition-transform duration-300 border border-gray-100"
              style={{
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />
          )}

          {/* If item is not available, show "Sold Out" overlay */}
          {!item.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Unavailable</span>
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md transition-all duration-300 hover:scale-110"
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked ? "fill-orange-500 text-orange-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3 min-w-0 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2 gap-2">
            {/* Name */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 min-w-0 flex-1 break-words">
              {item.name}
            </h3>

            <div className="flex-shrink-0 flex items-center space-x-1">
              {/* Veg Badge */}
              {item.isVegetarian ? (
                <div className="flex items-center bg-green-100 px-1.5 py-0.5 rounded-full mr-2">
                  <Leaf className="w-3 h-3 text-green-600" />
                  <span className="text-[10px] font-medium text-green-800 ml-1">
                    Veg
                  </span>
                </div>
              ) : (
                <div className="flex items-center bg-red-100 px-1.5 py-0.5 rounded-full mr-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 flex-shrink-0" />
                  <span className="text-[10px] font-medium text-red-800 ml-1">
                    Non-Veg
                  </span>
                </div>
              )}

              {/* Rating (only if present) */}
              {item.rating !== undefined && item.rating !== null && (
                <div className="flex items-center bg-green-100 px-1.5 py-0.5 rounded-full">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[11px] font-medium text-green-800 ml-1">
                    {item.rating}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] sm:text-sm text-gray-500 mb-2 line-clamp-2">
            {item.description}
          </p>

          {/* Price + View Button */}
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                ₹{item.half_price ? item.half_price : item.full_price}
              </span>
              {item.half_price ? (
                !isNaN(parseFloat(item.original_half_price)) && parseFloat(item.original_half_price) > 0 && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ₹{parseFloat(item.original_half_price).toFixed(2)}
                  </span>
                )
              ) : (
                !isNaN(parseFloat(item.original_full_price)) && parseFloat(item.original_full_price) > 0 && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ₹{parseFloat(item.original_full_price).toFixed(2)}
                  </span>
                )
              )}
            </div>
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

          {/* Category tag at the bottom */}
          {item.category && (
            <p className="mt-2 text-xs text-gray-500">
              Category: {item.category.name}
            </p>
          )}
        </div>
      </div>

      {/* Dialog for full details (only opens if available) */}
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

export default GridViewItem;
