import React, { useState, useRef, useEffect } from "react";
import { X, Heart, Star, ChevronLeft, ChevronRight, Leaf, Maximize2 } from "lucide-react";

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
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  const sizes = [];
  if (item.half_price != null && parseFloat(item.half_price) > 0) {
    sizes.push({
      id: "half",
      name: "Half",
      price: baseHalfPrice.toFixed(2),
      originalPrice: originalHalfPrice.toFixed(2),
    });
  }
  sizes.push({
    id: "full",
    name: "Full",
    price: baseFullPrice.toFixed(2),
    originalPrice: originalFullPrice.toFixed(2),
  });

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

  // Automatic Sliding Logic
  useEffect(() => {
    let intervalId;
    if (
      isOpen &&
      Array.isArray(item.images) &&
      item.images.length > 1
    ) {
      intervalId = setInterval(() => {
        nextImage();
      }, 3000); // Slide every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, item.images]);

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

  const humanizeCategory = (cat) => {
    if (!cat) return "";
    const str = typeof cat === 'object' ? cat.name : cat;
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
          {Array.isArray(item.images) && item.images.length > 0 ? (
            <>
              <div 
                className="relative w-full h-full cursor-zoom-in group"
                onClick={() => setIsFullScreen(true)}
              >
                <img
                  src={item.images[currentImageIndex]}
                  loading="lazy"
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {/* Click-to-Zoom hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300">
                    <Maximize2 className="w-6 h-6 text-slate-900" />
                  </div>
                </div>
              </div>
              {/* Navigation */}
              {item.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-all outline-none"
                    disabled={!item.available}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-all outline-none"
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
            <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-100">
              <img src="/logo.png" alt="No Image" className="max-w-[50%] max-h-[50%] object-contain" />
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
                  {item.isVegetarian ? (
                    <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-800 ml-1">
                        Veg
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center bg-red-100 px-2 py-1 rounded-full">
                      <div className="w-3 h-3 rounded-full bg-red-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-red-800 ml-1">
                        Non-Veg
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
                  const hasOriginalPrice =
                    !isNaN(parseFloat(size.originalPrice)) && parseFloat(size.originalPrice) > 0;
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
                        {hasOriginalPrice && (
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

      {/* High-End Fullscreen Image Viewer */}
      {isFullScreen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setIsFullScreen(false)}
        >
          {/* Close button with high-contrast text */}
          <button 
            className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:rotate-90 group z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreen(false);
            }}
          >
            <X className="w-8 h-8 group-hover:scale-110 transition-all" />
          </button>

          {/* Large image with smooth animation */}
          <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-12 animate-in zoom-in-95 duration-500">
            <img
              src={item.images[currentImageIndex]}
              alt={item.name}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* Close-on-click background hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-sm font-medium tracking-widest uppercase opacity-0 animate-in fade-in delay-700 duration-1000 hidden md:block">
            Click anywhere to close
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MenuItemDialog;
