import React, { useEffect, useRef } from "react";
import {
  ChevronDown,
  Grid,
  List,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  const categoryContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(false);

  const checkScroll = () => {
    if (categoryContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        categoryContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  const scroll = (direction) => {
    if (categoryContainerRef.current) {
      const scrollAmount = 200;
      categoryContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // We use a small timeout to avoid triggering too fast if the sentinel is visible
    // immediately after a state update.
    let timeoutId;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFetchingMore &&
          !dataManager.loading
        ) {
          // Add a tiny debounce to prevent accidental double-triggers
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            loadMore();
          }, 150);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }, // Slightly reduced margin for better control
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
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedCategory(category);
  };

  return (
    <section
      className="flex flex-col items-center w-full max-w-7xl px-4"
      id="menu"
    >
      {/* Header Section */}
      <div className="flex flex-col items-center w-full mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            Delicious Menu
          </h2>
          {dataManager.hotelDetails?.tableNumber && (
            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded-full shadow-sm">
              Table #{dataManager.hotelDetails.tableNumber}
            </span>
          )}
        </div>
        <div className="h-0.5 w-12 bg-black rounded-full mb-2" />
      </div>

      {/* Navigation and Controls */}
      <div className="flex flex-col w-full mb-6 sticky z-40 bg-white/90 backdrop-blur-xl p-2 sm:p-3 rounded-2xl shadow-sm border border-gray-100 gap-3">
        {/* Veg/Non-Veg Minimalist Toggle - Now at the Top */}
        <div className="flex justify-center w-full">
          <div className="flex bg-gray-100 p-0.5 rounded-xl w-full sm:w-auto overflow-hidden">
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
                  flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300
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

        {/* Categories - Minimalistic & Horizontal Scrollable with Arrows */}
        <div className="relative w-full group">
          {/* Left Arrow */}
          {showLeftArrow && (
            <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-white via-white/80 to-transparent pr-6 pointer-events-none transition-all duration-300">
              <button
                onClick={() => scroll("left")}
                className="p-1.5 bg-white rounded-full shadow-lg border border-gray-100 text-gray-800 pointer-events-auto hover:scale-110 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          <div
            ref={categoryContainerRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto overflow-y-hidden no-scrollbar justify-start sm:justify-start lg:justify-center gap-1.5 overscroll-contain px-2 py-1.5 scroll-smooth"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`
                  whitespace-nowrap px-4 py-1.5 rounded-full transition-all duration-300 text-xs font-medium
                  ${
                    selectedCategory === category
                      ? "bg-black text-white shadow-md transform scale-[1.02]"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }
                `}
              >
                {category === "all"
                  ? "All"
                  : category === "favourite"
                    ? "❤️ Favourite"
                    : category
                        .replace("_", " ")
                        .toUpperCase()
                        .replace("MAIN COURCE", "MAIN COURSE")}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-white via-white/80 to-transparent pl-6 pointer-events-none transition-all duration-300">
              <button
                onClick={() => scroll("right")}
                className="p-1.5 bg-white rounded-full shadow-lg border border-gray-100 text-gray-800 pointer-events-auto hover:scale-110 active:scale-95 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Controls: Sort and View Toggle */}
        <div className="flex justify-end items-center gap-3 w-full border-t border-gray-50 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Sorting Dropdown replaces the 'item found' text */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full sm:w-auto appearance-none px-3 py-1.5 pr-8 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-[10px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/5"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            {/* View Toggle */}
            <div className="flex p-0.5 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>{" "}
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
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
      <div ref={observerTarget} className="w-full flex justify-center py-8">
        {isFetchingMore && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Loading More Delights...
            </p>
          </div>
        )}
        {!hasMore &&
          filteredItems.length > 0 &&
          selectedCategory !== "favourite" && (
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
