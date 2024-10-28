import { ChevronDown, Filter } from "lucide-react";
import MenuItem from "./MenuItem";
import { useState, useEffect } from "react";
import seedrandom from "seedrandom";

// Categories Data
const categories = [
  { id: "all", name: "All" },
  { id: "popular", name: "Popular" },
  { id: "trending", name: "Trending" },
  { id: "featured", name: "Featured" },
  { id: "new", name: "New Arrivals" },
];

const MenuSection = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [shuffledItems, setShuffledItems] = useState(items);

  const seededShuffle = (array, seed) => {
    const rng = seedrandom(seed);
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const sortItems = (array, option) => {
    const sorted = [...array];
    if (option === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (option === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (option === "rating") {
      sorted.sort((a, b) => b.rating - a.rating); // Assume `rating` is in the item data
    }
    return sorted;
  };

  useEffect(() => {
    const shuffled = seededShuffle(items, selectedCategory);
    const sorted = sortItems(shuffled, sortOption);
    setShuffledItems(sorted);
  }, [selectedCategory, sortOption]);

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
        <div className="flex justify-between items-center w-full mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>

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
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-wrap w-full gap-6">
        {shuffledItems.map((item) => (
          <div
            key={item.id}
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
          >
            <MenuItem item={item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
