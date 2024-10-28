// src/utils/dataManager.js

import { useState, useEffect } from "react";
import menuData from "../constant/data";
import seedrandom from "seedrandom"; // You might need to install this package: npm install seedrandom

const categories = ["all", "popular", "trending", "featured", "new"];

export const useDataManager = () => {
  const [items] = useState(menuData);
  const [filteredItems, setFilteredItems] = useState(menuData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  // Use a seeded random number generator
  const rng = seedrandom("your-seed-here");

  // Assign random categories to items (only once)
  const [itemsWithCategories] = useState(() =>
    items.map((item) => ({
      ...item,
      category: categories[Math.floor(rng() * (categories.length - 1)) + 1], // Exclude 'all'
    }))
  );

  useEffect(() => {
    let result = [...itemsWithCategories];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.ingredients.includes(searchQuery)
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Apply sorting
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }
    // For "featured", we don't change the order

    setFilteredItems(result);
  }, [itemsWithCategories, searchQuery, selectedCategory, sortOption]);

  return {
    items: itemsWithCategories,
    filteredItems,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
  };
};
