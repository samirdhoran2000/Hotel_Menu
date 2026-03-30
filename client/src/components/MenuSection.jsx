import { Grid3X3, List, SlidersHorizontal } from "lucide-react";
import GridViewItem from "./GridViewItem";
import ListViewItem from "./ListViewItem";

const mainDietTabs = [
  { id: "all", name: "All" },
  { id: "veg", name: "Veg" },
  { id: "non-veg", name: "Non Veg" },
];

const MenuSection = ({ dataManager }) => {
  const {
    filteredItems,
    categoryTabs,
    selectedCategory,
    setSelectedCategory,
    selectedMainCategory,
    setSelectedMainCategory,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
  } = dataManager;

  return (
    <section id="menu" className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
      <div className="rounded-[32px] bg-gradient-to-br from-orange-100 via-amber-50 to-white px-6 py-12 text-center shadow-sm ring-1 ring-orange-100 sm:px-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">Hotel Menu</p>
        <h2 className="text-4xl font-black text-slate-900 sm:text-5xl">Our Special Menu</h2>
        <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
          Browse regular food categories together with Popular and Trending highlights. Every visible tab is connected to real filtering logic.
        </p>
      </div>

      <div className="flex flex-col gap-6 rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {mainDietTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMainCategory(tab.id)}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                selectedMainCategory === tab.id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                selectedCategory === tab.id
                  ? "bg-orange-500 text-white shadow-md"
                  : tab.type === "special"
                  ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-3xl bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
            <SlidersHorizontal className="h-4 w-4" />
            Sort and view controls
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none"
            >
              <option value="featured">Featured</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>

            <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-full p-2 ${viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-600"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-full p-2 ${viewMode === "list" ? "bg-slate-900 text-white" : "text-slate-600"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-[30px] bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-100">
          <h3 className="text-2xl font-bold text-slate-900">No items found</h3>
          <p className="mt-3 text-slate-600">Try another tab, another search term, or add new items from the admin dashboard.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-5"}>
          {filteredItems.map((item) =>
            viewMode === "grid" ? <GridViewItem key={item.id} item={item} /> : <ListViewItem key={item.id} item={item} />
          )}
        </div>
      )}
    </section>
  );
};

export default MenuSection;
