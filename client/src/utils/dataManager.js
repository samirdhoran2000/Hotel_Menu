// src/utils/dataManager.js

import { useState, useEffect } from "react";
import menuData from "../constant/data";
import seedrandom from "seedrandom"; // You might need to install this package: npm install seedrandom

const categories = ["all", "popular", "trending", "featured", "new"];

export const useDataManager = () => {
  const [items] = useState(menuData);
  const [filteredItems, setFilteredItems] = useState(menuData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState("list");
  const [likesUpdated, setLikesUpdated] = useState(0);

  // Use a seeded random number generator
  const rng = seedrandom(0);

  // Assign random categories to items (only once)
  const [itemsWithCategories] = useState(() =>
    items.map((item) => {
      const isNonVeg =
        /chicken|mutton|lobster|ribeye|meat|fish|prawn|egg/i.test(item.name) ||
        (item.ingredients &&
          item.ingredients.some((i) =>
            /chicken|mutton|lobster|meat|fish|prawn|egg/i.test(i)
          ));

      return {
        ...item,
        dietType: isNonVeg ? "non-veg" : "veg",
        category: categories[Math.floor(rng() * (categories.length - 1)) + 1], // Exclude 'all'
      };
    })
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
          (item.ingredients &&
            item.ingredients.some((i) =>
              i.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
    }

    // Apply main category filter (veg / non-veg)
    if (selectedMainCategory !== "all") {
      result = result.filter((item) => item.dietType === selectedMainCategory);
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
  }, [
    itemsWithCategories,
    searchQuery,
    selectedMainCategory,
    selectedCategory,
    sortOption,
    likesUpdated,
  ]);

  return {
    items: itemsWithCategories,
    filteredItems,
    searchQuery,
    setSearchQuery,
    selectedMainCategory,
    setSelectedMainCategory,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
  };
};
