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
  const [likesUpdated, setLikesUpdated] = useState(0);

  // Use a seeded random number generator
  const rng = seedrandom(0);

  // Assign random categories to items (only once)
  const [itemsWithCategories] = useState(() =>
    items.map((item) => ({
      ...item,
      category: categories[Math.floor(rng() * (categories.length - 1)) + 1], // Exclude 'all'
    }))
  );

  useEffect(() => {
    const handleLikesUpdate = () => setLikesUpdated((prev) => prev + 1);
    window.addEventListener("likesUpdated", handleLikesUpdate);
    return () => window.removeEventListener("likesUpdated", handleLikesUpdate);
  }, []);

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
    if (selectedCategory === "favorites") {
      const likedItems = JSON.parse(localStorage.getItem("likedItems") || "{}");
      result = result.filter((item) => likedItems[item.name]);
    } else if (selectedCategory !== "all") {
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
  }, [itemsWithCategories, searchQuery, selectedCategory, sortOption, likesUpdated]);

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
