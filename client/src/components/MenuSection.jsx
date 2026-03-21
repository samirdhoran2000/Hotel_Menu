import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Grid, List, Heart } from "lucide-react";
import ListViewItem from "./ListViewItem";
import GridViewItem from "./GridViewItem";

const categories = [
  { id: "all", name: "All" },
  { id: "popular", name: "Popular" },
  { id: "trending", name: "Trending" },
  { id: "featured", name: "Featured" },
  { id: "new", name: "New Arrivals" },
  { id: "favorites", name: "Favorites" },
];

const MenuSection = ({ dataManager }) => {
  const {
    filteredItems,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
  } = dataManager;

  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      // Determine if we haven't reached the end (giving a small 10px buffer)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    // Initial check
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <section
      className="flex flex-col items-center w-full max-w-7xl px-4"
      id="menu"
    >
      {/* Header Section */}
      <div className="flex flex-col items-center w-full mb-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-orange-400 text-center mb-3">
          Our Special Menu
        </h2>
        <p className="text-gray-600 text-center max-w-2xl text-lg">
          Discover our carefully curated selection of dishes, made with love and
          the finest ingredients
        </p>
      </div>

      {/* Navigation and Controls */}
      <div className="flex flex-col w-full mb-6 overflow-hidden">
        {/* Categories */}
        <div className="relative w-full mb-4 flex items-center group">
          {/* Left Arrow */}
          <button 
            onClick={() => scroll("left")}
            className={`absolute left-0 z-10 p-1.5 rounded-full bg-white shadow-md border border-gray-100 text-gray-500 hover:text-orange-600 transition-all ${
              showLeftArrow ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-3 pb-2 pt-2 w-full px-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex-shrink-0 px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 snap-center ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md shadow-orange-500/30 scale-105"
                    : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-orange-600 hover:shadow-sm border border-gray-100/50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll("right")}
            className={`absolute right-0 z-10 p-1.5 rounded-full bg-white shadow-md border border-gray-100 text-gray-500 hover:text-orange-600 transition-all ${
              showRightArrow ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Filters, Sort, and View Toggle */}
        <div className="flex justify-between items-center w-full mb-6">
          <div className="relative inline-flex">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 bg-white/60 backdrop-blur-sm border border-gray-100/50 rounded-xl hover:bg-white hover:shadow-sm transition-all text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
             
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-orange-100 text-orange-600 shadow-sm"
                    : "bg-white/60 text-gray-500 hover:bg-white hover:text-orange-500 hover:shadow-sm"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
               <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-orange-100 text-orange-600 shadow-sm"
                    : "bg-white/60 text-gray-500 hover:bg-white hover:text-orange-500 hover:shadow-sm"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      {filteredItems.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
          <Heart className={`w-16 h-16 mb-4 ${selectedCategory === "favorites" ? "text-orange-200" : "text-gray-200"}`} />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {selectedCategory === "favorites" ? "No favorites yet!" : "No items found"}
          </h3>
          <p className="text-gray-500 max-w-md">
            {selectedCategory === "favorites"
              ? "You haven't saved any items. Click the heart icon on any dish to view it here later."
              : "We couldn't find any items matching your current filters. Try adjusting your search or category."}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
              : "flex flex-col gap-6 w-full"
          }
        >
          {filteredItems.map((item) =>
            viewMode === "grid" ? (
              <GridViewItem key={item.id} item={item} />
            ) : (
              <ListViewItem key={item.id} item={item} />
            )
          )}
        </div>
      )}
    </section>
  );
};

export default MenuSection;
