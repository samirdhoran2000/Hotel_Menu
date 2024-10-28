// ListViewItem.js
import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
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
      <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <button
              onClick={handleLikeToggle}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
              />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {item.description}
          </p>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xl font-bold text-gray-900">
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

export default ListViewItem;
