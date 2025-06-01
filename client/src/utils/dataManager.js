// src/utils/dataManager.js

import { useState, useEffect } from "react";


export const useDataManager = () => {
  // --- raw data from API ---
  const [items, setItems] = useState([]); // the full list of fetched menuItems
  const [categories, setCategories] = useState([]); // ["all", "beverage", "main_course", …]

  // --- UI / filter state ---
  const [searchQuery, setSearchQuery] = useState(""); // text search
  const [selectedCategory, setSelectedCategory] = useState("all"); // single‐category filter
  const [sortOption, setSortOption] = useState("featured"); // e.g. "featured" | "price-asc" | "price-desc" | ...
  const [viewMode, setViewMode] = useState("grid"); // e.g. "grid" or "list"

  // --- filtered + sorted items exposed to UI ---
  const [filteredItems, setFilteredItems] = useState([]);

  // ──────────── 1. FETCH DATA + BUILD UNIQUE CATEGORY LIST ────────────
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/menu`);
        const json = await res.json();

        // Assume API response shape: { success: true, data: { menuItems: [ … ] } }
        const fetchedItems = json?.data?.menuItems || [];
        setItems(fetchedItems);

        // Build a Set of distinct categories
        const distinctCats = new Set(
          fetchedItems.map((it) => it.category || "")
        );
        // Turn into an array, filter out any empty strings or null; then prepend "all"
        const uniqueCatsArray = [
          "all",
          ...Array.from(distinctCats).filter((c) => c !== ""),
        ];
        setCategories(uniqueCatsArray);
      } catch (err) {
        console.error("Error fetching menu items:", err);
      }
    }
    fetchData();
  }, []); // run once on mount

  // ──────────── 2. COMPUTE FILTERED + SORTED RESULTS ────────────
  useEffect(() => {
    // Start from the full items array
    let result = Array.isArray(items) ? [...items] : [];

    // 2a) SEARCH FILTER
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const nameMatch = item.name?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const ingrMatch =
          Array.isArray(item.ingredients) &&
          item.ingredients.some((ing) => ing.toLowerCase().includes(q));
        return nameMatch || descMatch || ingrMatch;
      });
    }

    // 2b) CATEGORY FILTER
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 2c) SORTING
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "rating":
        // If your API sends a `rating` field, otherwise skip
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      // "featured" or default → leave as‐is
      default:
        break;
    }

    setFilteredItems(result);
  }, [items, searchQuery, selectedCategory, sortOption]);

  // ──────────── 3. RETURN EVERYTHING YOU’LL NEED IN YOUR COMPONENT ────────────
  return {
    // Raw data + category list
    items,
    categories, // ["all", "beverage", "main_course", …]

    // Filtered & sorted data
    filteredItems,

    // Filter/sort state + setters
    searchQuery,
    setSearchQuery,

    selectedCategory,
    setSelectedCategory,

    sortOption,
    setSortOption,

    // View‐mode (grid/list)
    viewMode,
    setViewMode,
  };
};
