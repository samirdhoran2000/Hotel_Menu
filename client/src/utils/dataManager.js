// src/utils/dataManager.js

import { useState, useEffect } from "react";

export const useDataManager = ({ id = null }) => {
  // --- raw data from API ---
  const [items, setItems] = useState([]); // the full list of fetched menuItems
  const [categories, setCategories] = useState([]); // ["all", "beverage", "main_course", …]

  // --- UI / filter state ---
  const [searchQuery, setSearchQuery] = useState(""); // text search
  const [selectedCategory, setSelectedCategory] = useState("all"); // single‐category filter
  const [sortOption, setSortOption] = useState("featured"); // e.g. "featured" | "price-asc" | "price-desc" | ...
  const [dietaryFilter, setDietaryFilter] = useState("all"); // "all" | "veg" | "non-veg"
  const [viewMode, setViewMode] = useState("list"); // e.g. "grid" or "list"
  const [loading, setLoading] = useState(true);
  const [hotelDetails, setHotelDetails] = useState({ name: "Hotel Menu", tableNumber: "" });
  
  // Favourites state (using IDs)
  const [likedItemIds, setLikedItemIds] = useState(() => {
    try {
      const stored = localStorage.getItem("favouriteItems");
      return stored ? JSON.parse(stored) : [];
    } catch (e) { return []; }
  });

  const toggleLike = (id) => {
    setLikedItemIds((prev) => {
      const isLiked = prev.includes(id);
      const next = isLiked ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("favouriteItems", JSON.stringify(next));
      return next;
    });
  };

  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      setLoading(true);
      try {
        const [menuRes, catRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/hotel/${id}`, { signal }),
          fetch(`${import.meta.env.VITE_API_URL}/category/public/${id}`, { signal }),
        ]);

        const menuJson = await menuRes.json();
        const catJson = await catRes.json();

        // Hotel Info
        if (menuJson?.success && menuJson?.data) {
          setHotelDetails({
            name: menuJson.data.hotelName || "Hotel Menu",
            tableNumber: menuJson.data.tableNumber || ""
          });
        }

        const fetchedItems = menuJson?.data?.menuItems || [];
        setItems(fetchedItems);

        // Map official categories from API, then filter to only those that have items
        const officialCats = catJson?.data?.map(c => c.name) || [];
        const activeCats = officialCats.filter(catName => 
          fetchedItems.some(item => item.category?.name === catName)
        );
        
        // Falling back to derived categories if official list is empty
        const derivedCats = Array.from(new Set(
          fetchedItems.map((it) => it.category?.name || "Other")
        )).filter(c => c !== "");

        const finalCats = activeCats.length > 0 ? activeCats : derivedCats;

        setCategories([
          "all",
          "favourite",
          ...finalCats,
        ]);
      } catch (err) {
        // ignore aborts, log others
        if (err.name !== "AbortError") {
          console.log("Error fetching menu items:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [id]);

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
      if (selectedCategory === "favourite") {
        result = result.filter((item) => likedItemIds.includes(item.id));
      } else {
        result = result.filter((item) => item.category?.name === selectedCategory);
      }
    }

    // 2c) DIETARY FILTER
    if (dietaryFilter === "veg") {
      result = result.filter((item) => item.isVegetarian === true);
    } else if (dietaryFilter === "non-veg") {
      result = result.filter((item) => item.isVegetarian === false);
    }

    // 2d) SORTING
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredItems(result);
  }, [items, searchQuery, selectedCategory, sortOption, dietaryFilter, likedItemIds]);

  // ──────────── 3. RETURN EVERYTHING YOU’LL NEED IN YOUR COMPONENT ────────────
  return {
    // Raw data + category list
    items,
    categories, // ["all", "beverage", "main_course", …]
    loading,
    hotelDetails,

    // Filtered & sorted data
    filteredItems,

    // Filter/sort state + setters
    searchQuery,
    setSearchQuery,

    selectedCategory,
    setSelectedCategory,

    sortOption,
    setSortOption,

    dietaryFilter,
    setDietaryFilter,

    likedItemIds,
    toggleLike,

    // View‐mode (grid/list)
    viewMode,
    setViewMode,
  };
};
