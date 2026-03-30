import { Menu, Search, Settings, UserCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { title: "Menu", href: "#menu" },
  { title: "About", href: "#about" },
  { title: "Contact", href: "#contact" },
  { title: "Setting", action: "settings" },
];

const Header = ({
  hotelName,
  toggleSidebar,
  searchQuery,
  setSearchQuery,
  onOpenSettings,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (item) => {
    if (item.action === "settings") {
      onOpenSettings();
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 border-orange-100 shadow-sm backdrop-blur-xl"
          : "bg-white/85 border-transparent backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="rounded-xl border border-orange-100 p-2 text-slate-700 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xl font-bold text-slate-900">{hotelName || "Digital Menu"}</p>
            <p className="text-xs text-slate-500">Fresh menu and hotel profile</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) =>
            item.href ? (
              <a key={item.title} href={item.href} className="text-sm font-semibold text-slate-700 transition hover:text-orange-600">
                {item.title}
              </a>
            ) : (
              <button key={item.title} onClick={() => handleNavClick(item)} className="text-sm font-semibold text-slate-700 transition hover:text-orange-600">
                {item.title}
              </button>
            )
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            {isSearchOpen ? (
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search dishes"
                  className="w-56 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 pr-10 text-sm outline-none focus:border-orange-400"
                />
                <button onClick={() => setIsSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="rounded-full border border-orange-200 p-2 text-slate-700 transition hover:bg-orange-50">
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-orange-50"
          >
            <Settings className="h-4 w-4" />
            <span>Setting</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <UserCircle2 className="h-4 w-4" />
            <span>{isAdminLoggedIn ? "Dashboard" : "Admin"}</span>
          </button>
        </div>
      </div>

      {isSearchOpen ? (
        <div className="border-t border-orange-100 bg-white px-4 py-3 sm:hidden">
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search dishes"
              className="w-full rounded-full border border-orange-200 bg-orange-50 px-4 py-2 pr-10 text-sm outline-none focus:border-orange-400"
            />
            <button onClick={() => setIsSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
