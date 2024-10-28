import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const Header = ({ toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Search query:", searchQuery);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-md shadow-md" : "backdrop-blur-md"
      }`}
    >
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between ${
            isScrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Left Section - Logo & Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Gourmet</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { title: "Menu", href: "#menu" },
              { title: "About", href: "#footer" },
              { title: "Contanct", href: "#footer" },
            ].map((item) => (
              <a
                key={item.title}
                href={`${item.href.toLowerCase()}`}
                className="relative font-medium text-gray-800 hover:text-black transition-colors py-2"
              >
                {item.title}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Section - Search */}
          <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <div className="hidden lg:block relative">
              {isSearchOpen && (
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search menu..."
                    className="w-64 py-2 pl-4 pr-10 rounded-lg bg-gray-100 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </form>
              )}
            </div>

            {/* Search Toggle Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-md">
          <div className="p-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full py-2 pl-4 pr-10 rounded-lg bg-gray-100 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                autoFocus
              />
              <button
                type="button"
                onClick={closeSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
