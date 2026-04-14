// src/utils/dataManager.js

import { useState, useEffect, useRef, useMemo } from "react";

// Cache for API responses to save bandwidth and improve performance
const apiCache = {}; 

// Helper to preload images into browser memory
const preloadImage = (src) => {
  if (!src) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
};

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
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false); // Start as false to prevent sentinel trigger before first load
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

  // Cache key based on current filter state (excluding page)
  const cacheKey = useMemo(() => {
    return JSON.stringify({
      id,
      searchQuery,
      selectedCategory,
      dietaryFilter,
      sortOption
    });
  }, [id, searchQuery, selectedCategory, dietaryFilter, sortOption]);

  // 1) Fetch Categories - ONLY ONCE or when ID changes
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        const catRes = await fetch(`${import.meta.env.VITE_API_URL}/category/public/${id}`, { 
          signal: controller.signal 
        });
        const catJson = await catRes.json();
        if (catJson?.success && catJson?.data) {
          const officialCats = catJson.data.map(c => c.name) || [];
          setCategories(["all", "favourite", ...officialCats]);
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
    return () => controller.abort();
  }, [id]);

  // 2) Fetch Menu Items - Depends on Page and Filters
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      // Check cache first for page 1 on filter change
      if (page === 1 && apiCache[cacheKey]) {
        const cached = apiCache[cacheKey];
        setItems(cached.items);
        setHasMore(cached.hasMore);
        setHotelDetails(cached.hotelDetails);
        setLoading(false);
        return;
      }

      // If it's a subsequent page that we already have in cache, skip (unlikely due to setPage(1) on filter change, but good for safety)
      if (page > 1 && apiCache[cacheKey] && apiCache[cacheKey].lastPage >= page) {
        return; 
      }

      if (page === 1) setLoading(true);
      else setIsFetchingMore(true);

      try {
        const params = new URLSearchParams({
          page: page,
          limit: 10,
          search: searchQuery,
          category: selectedCategory,
          dietary: dietaryFilter,
          sortOrder: sortOption === "price-desc" ? "DESC" : "ASC",
          sortBy: sortOption === "price-asc" || sortOption === "price-desc" ? "full_price" : "created_at"
        });

        const menuRes = await fetch(`${import.meta.env.VITE_API_URL}/hotel/${id}?${params.toString()}`, { signal });
        const menuJson = await menuRes.json();

        if (menuJson?.success && menuJson?.data) {
          if (page === 1) {
            setHotelDetails({
              name: menuJson.data.hotelName || "Hotel Menu",
              tableNumber: menuJson.data.tableNumber || ""
            });
          }
          
          const fetchedItems = menuJson?.data?.menuItems || [];
          const pagination = menuJson?.data?.pagination || {};

          const newItems = page === 1 ? fetchedItems : [...items, ...fetchedItems];
          
          setItems(newItems);
          const nextHasMore = pagination.hasNextPage || false;
          setHasMore(nextHasMore);

          // Update Cache
          apiCache[cacheKey] = {
            items: newItems,
            hasMore: nextHasMore,
            lastPage: page,
            hotelDetails: page === 1 ? {
              name: menuJson.data.hotelName || "Hotel Menu",
              tableNumber: menuJson.data.tableNumber || ""
            } : apiCache[cacheKey]?.hotelDetails
          };

          // --- Image Preloading Logic ---
          // Preload images for the newly fetched items to save bandwidth on scroll
          fetchedItems.forEach(item => {
            if (item.images && Array.isArray(item.images)) {
              item.images.forEach(imgUrl => preloadImage(imgUrl).catch(() => {}));
            }
          });
        } else {
          setHasMore(false);
          if (page === 1) setItems([]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching menu items:", err);
          setHasMore(false);
        }
      } finally {
        if (page === 1) setLoading(false);
        setIsFetchingMore(false);
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [id, page, searchQuery, selectedCategory, dietaryFilter, sortOption, cacheKey]);

  // Reset page and items when filters change
  useEffect(() => {
    setPage(1);
    // don't setHasMore(true) here; let the first result from page 1 decide it.
    // If not in cache, clear items immediately so UI shows loading instead of "No items"
    if (!apiCache[cacheKey]) {
      setItems([]);
      setLoading(true);
    }
  }, [searchQuery, selectedCategory, dietaryFilter, sortOption, cacheKey]);

  useEffect(() => {
    // Favourites logic remains local
    if (selectedCategory === "favourite") {
      const result = items.filter((item) => likedItemIds.includes(item.id));
      setFilteredItems(result);
    } else {
      // In other modes, we just use the items returned from the server (which are already filtered)
      setFilteredItems(items);
    }
  }, [items, selectedCategory, likedItemIds]);

  const loadMore = () => {
    if (hasMore && !isFetchingMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  // ──────────── 3. RETURN EVERYTHING YOU’LL NEED IN YOUR COMPONENT ────────────
  return {
    // Raw data + category list
    items,
    categories, // ["all", "beverage", "main_course", …]
    loading,
    isFetchingMore,
    hasMore,
    loadMore,
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
