// MenuSection.js
import React from "react";
import { ChevronDown, Grid, List } from "lucide-react";
import ListViewItem from "./ListViewItem";
import GridViewItem from "./GridViewItem";

const categories = [
  { id: "all", name: "All" },
  { id: "popular", name: "Popular" },
  { id: "trending", name: "Trending" },
  { id: "featured", name: "Featured" },
  { id: "new", name: "New Arrivals" },
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

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <section
      className="flex flex-col items-center w-full max-w-7xl px-4"
      id="menu"
    >
      {/* Header Section */}
      <div className="flex flex-col items-center w-full mb-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-orange-400 text-center mb-4">
          Our Special Menu
        </h2>
        <p className="text-gray-600 text-center max-w-2xl text-lg">
          Discover our carefully curated selection of dishes, made with love and
          the finest ingredients
        </p>
      </div>

      {/* Navigation and Controls */}
      <div className="flex flex-col w-full mb-8">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                  : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-orange-600 hover:shadow-md border border-gray-100/50"
              }`}
            >
              {category.name}
            </button>
          ))}
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
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-orange-100 text-orange-600 shadow-sm"
                    : "bg-white/60 text-gray-500 hover:bg-white hover:text-orange-500 hover:shadow-sm"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
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
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
    </section>
  );
};

export default MenuSection;
