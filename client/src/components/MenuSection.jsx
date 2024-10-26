import { ChevronDown, Filter } from "lucide-react";
import MenuItem from "./MenuItem";
import { useState } from "react";

// Categories Data
const categories = [
  { id: 'all', name: 'All' },
  { id: 'popular', name: 'Popular' },
  { id: 'trending', name: 'Trending' },
  { id: 'featured', name: 'Featured' },
  { id: 'new', name: 'New Arrivals' },
];
const MenuSection = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section
      className="w-full max-w-7xl px-4 "
      id="menu"
      
    >
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          Our Special Menu
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Discover our carefully curated selection of dishes, made with love and
          the finest ingredients
        </p>
      </div>

      <div className="mb-8">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
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

        {/* Filters and Sort */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>

          <div className="relative">
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
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;