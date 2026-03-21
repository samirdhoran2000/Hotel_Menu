// GridViewItem.js
import React, { useState, useEffect } from "react";
import { Heart, Star } from "lucide-react";
import MenuItemDialog from "./MenuItemDialog";

const GridViewItem = ({ item }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateLikeState = () => {
      const likedItems = JSON.parse(localStorage.getItem("likedItems") || "{}");
      setIsLiked(!!likedItems[item.name]);
    };
    updateLikeState();
    window.addEventListener("likesUpdated", updateLikeState);
    return () => window.removeEventListener("likesUpdated", updateLikeState);
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
    window.dispatchEvent(new Event("likesUpdated"));
  };

  return (
    <>
      <div
        className="relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square">
          <img
            src={item.images[0]}
            loading="lazy"
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          <button
            onClick={handleLikeToggle}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-all duration-300 hover:scale-110 hover:bg-white"
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked ? "fill-orange-500 text-orange-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
              {item?.name?.length > 17
                ? `${item?.name?.slice(0, 17)}...`
                : item?.name}
            </h3>
            <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-green-800">
                {item.rating}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {item.description}
          </p>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-orange-600">
                ₹{item.price}
              </span>
              <span className="text-sm text-gray-500 line-through ml-2">
                ₹{item.originalPrice}
              </span>
            </div>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-xl transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
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
