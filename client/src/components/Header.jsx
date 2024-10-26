import { Menu, ShoppingCart, X } from "lucide-react";

const Header = ({ toggleSidebar }) => (
  <header className="bg-white shadow-md fixed w-full top-0 z-50">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <button onClick={toggleSidebar} className="lg:hidden">
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="text-2xl font-bold">Restaurant Name</h1>
      <button className="relative">
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
          0
        </span>
      </button>
    </div>
  </header>
);

export default Header;
