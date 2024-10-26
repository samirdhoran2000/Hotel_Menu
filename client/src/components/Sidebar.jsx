import { Menu, ShoppingCart, X } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => (
  <div
    className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "block" : "hidden"}`}
  >
    <div
      className="absolute inset-0 bg-black bg-opacity-50"
      onClick={onClose}
    />
    <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg">
      <div className="p-4">
        <button onClick={onClose} className="mb-4">
          <X className="w-6 h-6" />
        </button>
        <nav className="space-y-4">
          <a href="#appetizers" className="block text-lg hover:text-gray-600">
            Appetizers
          </a>
          <a href="#main-courses" className="block text-lg hover:text-gray-600">
            Main Courses
          </a>
          <a href="#desserts" className="block text-lg hover:text-gray-600">
            Desserts
          </a>
          <a href="#drinks" className="block text-lg hover:text-gray-600">
            Drinks
          </a>
        </nav>
      </div>
    </div>
  </div>
);

export default Sidebar;
