import React, { useState, useRef, useEffect } from "react";
import { X, Heart, Star, ChevronLeft, ChevronRight, Leaf } from "lucide-react";
import promotionalVideo from '../../src/assets/promotional_video.mp4'

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative z-10 max-w-3xl w-full mx-4 bg-white rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const MenuItemDialog = ({ item, isOpen, isLiked, onLikeToggle, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("full");
  const [selectedMediaTab, setSelectedMediaTab] = useState("photos");

  // Parse ingredients
  const ingredientsArray =
    typeof item.ingredients === "string"
      ? JSON.parse(item.ingredients)
      : item.ingredients;

  // Parse prices
  const baseHalfPrice = parseFloat(item.half_price) || 0;
  const originalHalfPrice = parseFloat(item.original_half_price) || 0;
  const baseFullPrice = parseFloat(item.full_price) || 0;
  const originalFullPrice = parseFloat(item.original_full_price) || 0;

  const sizes = [
    {
      id: "half",
      name: "Half",
      price: baseHalfPrice.toFixed(2),
      originalPrice: originalHalfPrice.toFixed(2),
    },
    {
      id: "full",
      name: "Full",
      price: baseFullPrice.toFixed(2),
      originalPrice: originalFullPrice.toFixed(2),
    },
  ];

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setSelectedMediaTab("photos");
    }
  }, [isOpen]);

  const nextImage = () => {
    if (!Array.isArray(item.images) || item.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    if (!Array.isArray(item.images) || item.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? item.images.length - 1 : prev - 1
    );
  };

  const humanizeCategory = (str) => {
    if (!str) return "";
    return str
      .split("_")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
        {/* Left – Media Gallery */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-gray-100">
          {/* Media Tabs */}
          {item?.video && <div className="absolute top-4 left-4 flex space-x-2 bg-white/80 rounded-full shadow-lg p-1 z-20">
            <button
              onClick={() => setSelectedMediaTab("photos")}
              className={`px-4 py-1 rounded-full transition-all ${
                selectedMediaTab === "photos"
                  ? "bg-black text-white"
                  : "text-gray-600"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setSelectedMediaTab("videos")}
              className={`px-4 py-1 rounded-full transition-all ${
                selectedMediaTab === "videos"
                  ? "bg-black text-white"
                  : "text-gray-600"
              }`}
            >
              Videos
            </button>
          </div>}

          {selectedMediaTab === "photos" ? (
            Array.isArray(item.images) && item.images.length > 0 ? (
              <>
                <img
                  src={item.images[currentImageIndex]}
                  loading="lazy"
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {/* Navigation */}
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-all"
                      disabled={!item.available}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-all"
                      disabled={!item.available}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {/* Indicators */}
                {item.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {item.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "bg-white w-4"
                            : "bg-white/50"
                        }`}
                        disabled={!item.available}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              {Array.isArray(item.videos) && item.videos.length > 0 ? (
                <video
                  src={
                    "https://youtube.com/shorts/SR4_mQPk0ss?si=gst3Inxyn7UBAirc"
                  }
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={promotionalVideo}
                  controls
                  className="w-full h-full object-contain"
                  autoPlay
                />
                // <span className="text-white">No Video Available</span>
              )}
            </div>
          )}

          {/* Sold Out Overlay */}
          {!item.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Right – Details */}
        <div className="relative flex-1 flex flex-col max-h-[50vh] md:max-h-full overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {item.name}
                </h2>
                <div className="flex items-center space-x-4">
                  {item.isVegetarian && (
                    <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-800 ml-1">
                        Veg
                      </span>
                    </div>
                  )}
                  {item.rating != null && (
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium">{item.rating}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 pr-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLikeToggle(e);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isLiked
                        ? "fill-orange-500 text-orange-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{item.description}</p>
            {item.category && (
              <p className="text-sm text-gray-500 mb-4">
                Category: {humanizeCategory(item.category)}
              </p>
            )}

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Choose Size</h3>
              <div className="flex space-x-4">
                {sizes.map((size) => {
                  const isDiscounted =
                    parseFloat(size.originalPrice) > parseFloat(size.price);
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                        selectedSize === size.id
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-300"
                      } ${
                        !item.available ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!item.available}
                    >
                      <div className="text-sm">{size.name}</div>
                      <div className="flex items-baseline space-x-2">
                        <span className="font-semibold">₹{size.price}</span>
                        {isDiscounted && (
                          <span className="text-sm line-through text-gray-500">
                            ₹{size.originalPrice}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ingredients */}
            {Array.isArray(ingredientsArray) && ingredientsArray.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {ingredientsArray.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MenuItemDialog;
