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
  QrCode
} from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/hotel/dashboard", exact: true },
    // { icon: Users, label: "Users", path: "/hotel/dashboard/users" },
    { icon: BarChart3, label: "Analytics", path: "/hotel/dashboard/analytics" },
    // { icon: ShoppingCart, label: "Orders", path: "/hotel/dashboard/orders" },
    { icon: FileText, label: "Menu", path: "/hotel/dashboard/menu" },
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-18"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="text-xl font-bold text-white">DashBoard</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors hover:bg-gray-700 ${
                    isActive(item.path, item.exact) ? "bg-blue-600" : ""
                  }`}
                >
                  <item.icon size={20} />
                  {sidebarOpen && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/hotel/dashboard"
                className="px-3 py-1 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/hotel/dashboard/menu"
                className="px-3 py-1 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Menu
              </Link>
              <Link
                to="/hotel/dashboard/qrcodes"
                className="px-3 py-1 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                QR Codes
              </Link>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
              </button>

              <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <User size={20} />
                <span className="font-medium">Admin</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area - This will render child routes */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
