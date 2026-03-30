import { useEffect, useMemo, useState } from "react";
import menuData from "../constant/data";
import { API_BASE_URL } from "./config";

const STATIC_TOP_TABS = [
  { id: "all", name: "All", type: "special" },
  { id: "popular", name: "Popular", type: "special" },
  { id: "trending", name: "Trending", type: "special" },
];

const mapFallbackItems = () =>
  menuData.map((item, index) => {
    const type = /chicken|mutton|lobster|ribeye|meat|fish|prawn|egg/i.test(item.name)
      ? "non-veg"
      : "veg";

    const categoryFlow = ["Starter", "Main Course", "Dessert", "Beverages"];

    return {
      id: item.id || `fallback-${index}`,
      name: item.name,
      price: item.price || 0,
      originalPrice: item.originalPrice || item.price || 0,
      rating: item.rating || 4.2,
      images: item.images || ["/dish_A.jpeg"],
      ingredients: item.ingredients || [],
      description: item.description || "Freshly prepared menu item",
      type,
      categoryName: categoryFlow[index % categoryFlow.length],
      isPopular: index % 3 === 0,
      isTrending: index % 4 === 0,
      isAvailable: true,
    };
  });

export const useDataManager = (hotelProfile) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [likesUpdated, setLikesUpdated] = useState(0);

  const fallbackItems = useMemo(() => mapFallbackItems(), []);

  useEffect(() => {
    const handleLikesUpdate = () => setLikesUpdated((prev) => prev + 1);
    window.addEventListener("likesUpdated", handleLikesUpdate);
    return () => window.removeEventListener("likesUpdated", handleLikesUpdate);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!hotelProfile?.hotelId) {
        setCategories([]);
        setItems(fallbackItems);
        return;
      }

      try {
        const [categoryResponse, itemResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/category?hotelId=${encodeURIComponent(hotelProfile.hotelId)}`),
          fetch(`${API_BASE_URL}/api/item?hotelId=${encodeURIComponent(hotelProfile.hotelId)}`),
        ]);

        const categoryData = await categoryResponse.json().catch(() => []);
        const itemData = await itemResponse.json().catch(() => []);

        if (Array.isArray(categoryData)) {
          setCategories(categoryData);
        }

        if (Array.isArray(itemData) && itemData.length > 0) {
          setItems(
            itemData.map((item, index) => ({
              id: item._id || `item-${index}`,
              name: item.name,
              price: item.price || 0,
              originalPrice: item.originalPrice || item.price || 0,
              rating: item.rating || 4.2,
              images:
                Array.isArray(item.images) && item.images.length > 0
                  ? item.images.map((image) =>
                      image.startsWith("http") ? image : `${API_BASE_URL}${image}`
                    )
                  : ["/dish_A.jpeg"],
              ingredients: item.ingredients || [],
              description: item.description || "Freshly prepared menu item",
              type: item.type === "nonveg" ? "non-veg" : item.type || "veg",
              categoryId: item.categoryId || "",
              categoryName: item.categoryName || item.category || "Starter",
              isPopular: Boolean(item.isPopular),
              isTrending: Boolean(item.isTrending),
              isAvailable: item.isAvailable !== false,
            }))
          );
        } else {
          setItems(fallbackItems);
        }
      } catch {
        setCategories([]);
        setItems(fallbackItems);
      }
    };

    loadData();
  }, [fallbackItems, hotelProfile?.hotelId]);

  const categoryTabs = useMemo(
    () => [
      ...STATIC_TOP_TABS,
      ...categories.map((category) => ({
        id: category._id,
        name: category.name,
        type: "regular",
      })),
    ],
    [categories]
  );

  useEffect(() => {
    let result = [...items].filter((item) => item.isAvailable !== false);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.categoryName.toLowerCase().includes(query) ||
          item.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query))
      );
    }

    if (selectedMainCategory !== "all") {
      result = result.filter((item) => item.type === selectedMainCategory);
    }

    if (selectedCategory === "popular") {
      result = result.filter((item) => item.isPopular);
    } else if (selectedCategory === "trending") {
      result = result.filter((item) => item.isTrending);
    } else if (selectedCategory !== "all") {
      result = result.filter(
        (item) => item.categoryId === selectedCategory || item.categoryName === selectedCategory
      );
    }

    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredItems(result);
  }, [items, likesUpdated, searchQuery, selectedCategory, selectedMainCategory, sortOption]);

  return {
    items,
    categories,
    categoryTabs,
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
