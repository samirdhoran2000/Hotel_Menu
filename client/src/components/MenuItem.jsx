import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Heart,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";

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

const MenuItemDialog = ({ item, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("medium");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const sizes = [
    { id: "half", name: "Half", price: item.price * 0.8 },
    { id: "full", name: "Full", price: item.price },
    // { id: "large", name: "Large", price: item.price * 1.2 },
  ];

//   const nutritionalInfo = {
//     calories: "650 kcal",
//     protein: "24g",
//     carbs: "85g",
//     fat: "22g",
//     fiber: "8g",
//   };

  const ingredients = [
    "Fresh Tomatoes",
    "Mozzarella",
    "Basil",
    "Olive Oil",
    "Italian Herbs",
    "Sea Salt",
    ];
    
   

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? item.images.length - 1 : prev - 1
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
        {/* Left side - Image Gallery */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-gray-100">
          <img
            src={item.images[currentImageIndex]}
            alt={item.name}
            className="w-full h-full object-cover"
          />

          {item.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {item.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right side - Content */}
        <div className="relative flex-1 flex flex-col max-h-[50vh] md:max-h-full overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 bg-gray-400 rounded-full transition-all"
          >
            <X className="w-8 h-8 " />
          </button>

          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {item.name}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-medium">4.8</span>
                    <span className="ml-1 text-gray-500">(2.5k reviews)</span>
                  </div>
                  {/* <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>20-25 min</span>
                  </div> */}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <div className="w-6 h-6 " />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">{item.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Choose Size</h3>
              <div className="flex space-x-4">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      selectedSize === size.id
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm">{size.name}</div>
                    <div className="font-semibold">₹{size.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Nutritional Info */}
            {/* <div className="mb-6">
              <h3 className="font-semibold mb-3">Nutritional Information</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {Object.entries(nutritionalInfo).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-500 capitalize">
                      {key}
                    </span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Add to Cart Section */}
            {/* <div className="sticky bottom-0 left-0 right-0 mt-4 pt-4 border-t bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button className="flex-1 ml-4 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all active:scale-95">
                  Add to Cart - ₹
                  {(
                    sizes.find((s) => s.id === selectedSize).price * quantity
                  ).toFixed(2)}
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const MenuItem = ({ item }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
 function generateRandom(min, max) {
   return (Math.random()*(max-min)+min).toFixed(1);
 }

 useEffect(() => {}, []);
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
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
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
              <span className="text-sm font-medium">
                {generateRandom(3,5)}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {item.description}
          </p>

          <div className="flex justify-between items-center">
            <div>
              {/* <span className="text-2xl font-bold text-gray-900"> ₹{item.price}</span> */}
              <span className="text-2xl font-bold text-gray-900">
                {" "}
                ₹{generateRandom(500,1000)}
              </span>
              <span className="text-sm text-gray-500 line-through ml-2">
                ₹{generateRandom(1000,2000)}
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

export default MenuItem;
