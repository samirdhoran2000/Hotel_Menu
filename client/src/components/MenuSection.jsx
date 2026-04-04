import React, { useEffect, useRef } from "react";
import { ChevronDown, Grid, List, Loader2 } from "lucide-react";
import ListViewItem from "./ListViewItem";
import GridViewItem from "./GridViewItem";

const MenuSection = ({ dataManager }) => {
  const {
    filteredItems,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    hasMore,
    isFetchingMore,
    loadMore,
  } = dataManager;

  const observerTarget = useRef(null);

  useEffect(() => {
    // We use a small timeout to avoid triggering too fast if the sentinel is visible
    // immediately after a state update.
    let timeoutId;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore && !dataManager.loading) {
          // Add a tiny debounce to prevent accidental double-triggers
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            loadMore();
          }, 150); 
        }
      },
      { threshold: 0.1, rootMargin: "100px" } // Slightly reduced margin for better control
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      clearTimeout(timeoutId);
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isFetchingMore, loadMore, dataManager.loading]);

  const handleCategoryChange = (category) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedCategory(category);
  };

  return (
    <section
      className="flex flex-col items-center w-full max-w-7xl px-4"
      id="menu"
    >
      {/* Header Section */}
      <div className="flex flex-col items-center w-full mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            Delicious Menu
          </h2>
          {dataManager.hotelDetails?.tableNumber && (
            <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full shadow-sm">
              Table #{dataManager.hotelDetails.tableNumber}
            </span>
          )}
        </div>
        <div className="h-1 w-20 bg-black rounded-full mb-4" />
      </div>

      {/* Navigation and Controls */}
      <div className="flex flex-col w-full mb-8 sticky z-40 bg-white/90 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-sm border border-gray-100 gap-4">
        {/* Veg/Non-Veg Minimalist Toggle - Now at the Top */}
        <div className="flex justify-center w-full">
          <div className="flex bg-gray-100 p-1 rounded-2xl w-full sm:w-auto overflow-hidden">
            {[
              {
                id: "all",
                label: "All",
                color: "bg-white text-black shadow-sm",
              },
              {
                id: "veg",
                label: "Veg",
                color: "bg-green-500 text-white shadow-sm",
              },
              {
                id: "non-veg",
                label: "Non-Veg",
                color: "bg-red-500 text-white shadow-sm",
              },
            ].map((diet) => (
              <button
                key={diet.id}
                onClick={() => dataManager.setDietaryFilter(diet.id)}
                className={`
                  flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300
                  ${
                    dataManager.dietaryFilter === diet.id
                      ? diet.color
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                  }
                `}
              >
                {diet.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories - Minimalistic & Horizontal Scrollable */}
        <div className="flex overflow-x-auto no-scrollbar justify-start sm:justify-center gap-2 overscroll-contain">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`
                whitespace-nowrap px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium
                ${
                  selectedCategory === category
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }
              `}
            >
              {category === "all"
                ? "All"
                : category === "favourite"
                  ? "❤️ Favourite"
                  : category.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>

        {/* Bottom Controls: Sort and View Toggle */}
        <div className="flex justify-end items-center gap-3 w-full border-t border-gray-50 pt-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Sorting Dropdown replaces the 'item found' text */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full sm:w-auto appearance-none px-4 py-2 pr-10 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/5"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            {/* View Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>{" "}
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      {dataManager.loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full opacity-60">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-gray-100 animate-pulse rounded-3xl h-80 w-full"
            />
          ))}
        </div>
      ) : filteredItems && filteredItems.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
              : "flex flex-col gap-6 w-full"
          }
        >
          {filteredItems.map((item) =>
            viewMode === "grid" ? (
              <GridViewItem
                key={item.id}
                item={item}
                isLiked={dataManager.likedItemIds.includes(item.id)}
                onLikeToggle={() => dataManager.toggleLike(item.id)}
              />
            ) : (
              <ListViewItem
                key={item.id}
                item={item}
                isLiked={dataManager.likedItemIds.includes(item.id)}
                onLikeToggle={() => dataManager.toggleLike(item.id)}
              />
            ),
          )}
        </div>
      ) : null}

      {/* Loading More Spinner / Sentinel */}
      <div 
        ref={observerTarget} 
        className="w-full flex justify-center py-8"
      >
        {isFetchingMore && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Loading More Delights...
            </p>
          </div>
        )}
        {!hasMore && filteredItems.length > 0 && selectedCategory !== "favourite" && (
           <div className="flex flex-col items-center gap-2 opacity-40">
             <div className="h-px w-12 bg-gray-300 mb-2" />
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
               You've reached the end
             </p>
           </div>
        )}
      </div>

      {filteredItems && filteredItems.length === 0 && !dataManager.loading ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 w-full max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <span className="text-3xl">❤️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {selectedCategory === "favourite"
              ? "Your favourites is empty!"
              : "No items found!"}
          </h3>
          <p className="text-gray-500 max-w-sm">
            {selectedCategory === "favourite"
              ? "Explore our delicious menu and tap the heart icon to save your favorite dishes here."
              : "We couldn't find any items matching your current filters. Try adjusting your search or category."}
          </p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="mt-6 px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all active:scale-95"
          >
            Explore Menu
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default MenuSection;
