import { X } from "lucide-react";

const Sidebar = ({ isOpen, onClose, categories = [], selectedCategory, setSelectedCategory }) => {
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onClose();
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "block" : "hidden"}`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-20 transition-opacity"
        onClick={onClose}
      />
      <div
        className={`absolute left-0 top-0 h-full w-64 backdrop-blur-md bg-white/90 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Menu Categories</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-1 pr-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-black text-white shadow-md transform scale-[1.02]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2 overflow-hidden">
                  <span className="font-medium text-sm truncate uppercase tracking-wide">
                    {category === "all"
                      ? "All Items"
                      : category === "favourite"
                      ? "❤️ Favourite"
                      : category.replace("_", " ")}
                  </span>
                  {selectedCategory === category && (
                    <div className="min-w-[8px] h-2 bg-white rounded-full animate-pulse flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className="space-y-1">
              <a href="#footer" className="block px-4 py-2 text-gray-500 hover:text-black">About Us</a>
              <a href="#footer" className="block px-4 py-2 text-gray-500 hover:text-black">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
