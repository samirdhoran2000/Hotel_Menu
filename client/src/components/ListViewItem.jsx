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
      <div className="flex items-stretch space-x-4 p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
        <div className="relative w-32 h-32 flex-shrink-0">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={handleLikeToggle}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md transition-all duration-300 hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-green-800">
                  {item.rating}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {item.description}
            </p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ₹{item.price}
              </span>
              <span className="text-sm text-gray-500 line-through ml-2">
                ₹{item.originalPrice}
              </span>
            </div>
            <div className="flex items-center space-x-2">

              <button
                onClick={() => setIsDialogOpen(true)}
                className="px-4 py-2 bg-black text-white rounded-lg transition-all duration-300 hover:bg-gray-800 active:scale-95"
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
