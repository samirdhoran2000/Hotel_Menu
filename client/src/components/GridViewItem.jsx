// GridViewItem.js
import React, { useState, useEffect } from "react";
import { Heart, Star, Leaf } from "lucide-react"; // Added a Leaf icon for Veg badge
import MenuItemDialog from "./MenuItemDialog";

const GridViewItem = ({ item }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
          <img
            src={item.images[0]}
            loading="lazy"
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />

          {/* If item is not available, show "Sold Out" overlay */}
          {!item.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Sold Out</span>
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
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            {/* Name */}
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
              {item.name.length > 17 ? item.name.slice(0, 17) + "…" : item.name}
            </h3>

            <div className="flex items-center space-x-1">
              {/* Veg Badge */}
              {item.isVegetarian && (
                <div className="flex items-center bg-green-100 px-2 py-1 rounded-full mr-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-800 ml-1">
                    Veg
                  </span>
                </div>
              )}

              {/* Rating (only if present) */}
              {item.rating !== undefined && item.rating !== null && (
                <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-green-800 ml-1">
                    {item.rating}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {item.description}
          </p>

          {/* Price + View Button */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ₹{item.price}
              </span>
              {item.original_price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{item.original_price}
                </span>
              )}
            </div>
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

          {/* Category tag at the bottom */}
          {item.category && (
            <p className="mt-2 text-xs text-gray-500">
              Category: {humanizeCategory(item.category)}
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
};

export default GridViewItem;
