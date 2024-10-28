// GridViewItem.js
import React, { useState, useEffect } from "react";
import { Heart, Star } from "lucide-react";
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

  return (
    <>
      <div
        className="relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          <button
            onClick={handleLikeToggle}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md transition-all duration-300 hover:scale-110"
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {item?.name?.length > 17
                ? `${item?.name?.slice(0, 17)}...`
                : item?.name}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{item.rating}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {item.description}
          </p>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ₹{item.price}
              </span>
              <span className="text-sm text-gray-500 line-through ml-2">
                ₹{item.originalPrice}
              </span>
            </div>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-300 hover:bg-gray-800 active:scale-95"
            >
              View
            </button>
          </div>
        </div>
      </div>
      <MenuItemDialog
        item={item}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default GridViewItem;
