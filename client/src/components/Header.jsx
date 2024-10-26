import { Menu, Search, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
const Header = ({ toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-transparent filter backdrop-blur-md shadow-md py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Gourmet</h1>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#menu" className="text-gray-800 hover:text-black">
              Menu
            </a>
            <a href="#about" className="text-gray-800 hover:text-black">
              About
            </a>
            <a href="#contact" className="text-gray-800 hover:text-black">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-6 h-6" />
            </button>
            {/* <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </button> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
