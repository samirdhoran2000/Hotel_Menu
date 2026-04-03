import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  User,
  FileText,
  ShoppingCart,
  QrCode,
  List
} from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  // Handle window resize to auto-hide sidebar on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-close sidebar on mobile after navigation
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/hotel/dashboard", exact: true },
    // { icon: Users, label: "Users", path: "/hotel/dashboard/users" },
    { icon: BarChart3, label: "Analytics", path: "/hotel/dashboard/analytics" },
    // { icon: ShoppingCart, label: "Orders", path: "/hotel/dashboard/orders" },
    { icon: FileText, label: "Menu", path: "/hotel/dashboard/menu" },
    { icon: List, label: "Categories", path: "/hotel/dashboard/categories" },
    { icon: QrCode, label: "QR Codes", path: "/hotel/dashboard/settings" },
    // { icon: Settings, label: "Settings", path: "/hotel/dashboard/settings" },
    // { icon: Settings, label: "temp1", path: "/hotel/dashboard/temp1" },
    // { icon: Settings, label: "temp2", path: "/hotel/dashboard/temp2" },
    // { icon: Settings, label: "temp3", path: "/hotel/dashboard/temp3" },
    // { icon: Settings, label: "temp4", path: "/hotel/dashboard/temp4" },
    // { icon: Settings, label: "temp5", path: "/hotel/dashboard/temp5" },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Overlay (Mobile Only) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${sidebarOpen ? "w-64 translate-x-0" : "w-18 -translate-x-full lg:translate-x-0"} 
          fixed lg:relative z-50 h-full bg-gray-900 text-white transition-all duration-300 flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 min-h-[80px] flex items-center">
          <div className="flex items-center justify-between w-full">
            {sidebarOpen && (
              <h2 className="text-xl font-bold text-white truncate">DashBoard</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors ml-auto"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center p-3 rounded-lg transition-colors hover:bg-gray-700 ${
                    isActive(item.path, item.exact) ? "bg-blue-600 shadow-lg" : ""
                  }`}
                >
                  <item.icon size={20} className="shrink-0" />
                  {sidebarOpen && (
                    <span className="ml-3 font-medium truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-3 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu size={20} />
                </button>
              )}
              <h1 className="text-lg md:text-2xl font-semibold text-gray-800 truncate">
                {menuItems.find(item => isActive(item.path, item.exact))?.label || "Dashboard"}
              </h1>
            </div>

            {/* Desktop Navigation Group */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/hotel/dashboard"
                className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/hotel/dashboard/menu"
                className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Menu
              </Link>
              <Link
                to="/hotel/dashboard/settings"
                className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                QR Codes
              </Link>
            </div>

            {/* Right Section Actions */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <div className="hidden sm:relative sm:block">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32 md:w-48 transition-all"
                />
              </div>

              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
              </button>

              <button className="flex items-center gap-2 p-1.5 md:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                <span className="hidden sm:block text-sm font-medium">Admin</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
