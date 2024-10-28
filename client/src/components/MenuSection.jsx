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
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          Our Special Menu
        </h2>
        <p className="text-gray-800 text-center max-w-2xl">
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
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
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
              className="appearance-none px-4 py-2 pr-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
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
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-gray-200"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-gray-200"
                    : "bg-gray-100 hover:bg-gray-200"
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
