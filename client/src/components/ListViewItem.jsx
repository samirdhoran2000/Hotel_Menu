// ListViewItem.js
import React, { useState, useEffect } from "react";
import { Heart, Star, Clock } from "lucide-react";
import MenuItemDialog from "./MenuItemDialog";

const ListViewItem = ({ item }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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
      <div className="flex items-stretch space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={item.images[0]}
            loading="lazy"
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <button
            onClick={handleLikeToggle}
            className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-all duration-300 hover:scale-110 hover:bg-white z-10"
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? "fill-orange-500 text-orange-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 pr-2">
                {item.name}
              </h3>
              <div className="flex-shrink-0 flex items-center space-x-1 bg-green-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs sm:text-sm font-medium text-green-800">
                  {item.rating}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
              {item.description}
            </p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xl sm:text-2xl font-bold text-orange-600">
                ₹{item.price}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 line-through ml-1.5">
                ₹{item.originalPrice}
              </span>
            </div>
            <div className="flex items-center space-x-2">

              <button
                onClick={() => setIsDialogOpen(true)}
                className="px-4 py-1.5 sm:px-5 sm:py-2.5 text-sm sm:text-base bg-gray-900 text-white font-medium rounded-xl transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
              >
                View
              </button>
            </div>
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

export default ListViewItem;
