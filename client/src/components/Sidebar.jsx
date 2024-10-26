import { X } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => (
  <div
    className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "block" : "hidden"}`}
  >
    <div
      className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
      onClick={onClose}
    />
    <div
      className={`absolute left-0 top-0 h-full w-64 backdrop-blur-md shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors mb-4"
        >
          <X className="w-6 h-6" />
        </button>
        <nav className="space-y-4">
          <a href="#menu" className="block text-lg hover:text-gray-600 py-2">
            Menu
          </a>
          <a href="#about" className="block text-lg hover:text-gray-600 py-2">
            About
          </a>
          <a href="#contact" className="block text-lg hover:text-gray-600 py-2">
            Contact
          </a>
        </nav>
      </div>
    </div>
  </div>
);

export default Sidebar;
