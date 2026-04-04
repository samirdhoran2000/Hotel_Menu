import React, { useState, useEffect } from "react";
import { BarChart3, Menu, X, User, ChevronDown, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsMobileMenuOpen(false);
   
   
  };

  const navLinks = [
    { name: "Home", path: "/#" },
    { name: "Features", path: "/#why-we-exist" },
    { name: "Free", path: "/#why-its-free" },
    { name: "Contact Us", path: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-slate-900/90 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl shadow-purple-500/10"
          : "bg-slate-900/70 backdrop-blur-lg border-b border-purple-500/10"
      }`}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-slate-900/40 to-blue-900/20"></div>

      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        ></div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => handleLinkClick("/")}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="p-2 md:m-1 bg-gradient-to-r from-slate-900 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                {/* <BarChart3 className="w-6 h-6 text-white" /> */}
                <img
                  src={logo}
                  alt="Logo"
                  width={50}
                  height={50}
                  className=""
                />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              EasyMenu
            </h1>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                onClick={() => handleLinkClick(link.path)}
                href={link.path}
                className={`relative font-medium text-sm lg:text-base transition-all duration-300 group px-4 py-2 rounded-xl ${
                  activeLink === link.path
                    ? "text-purple-300 bg-white/10 backdrop-blur-sm"
                    : "text-white/80 hover:text-white hover:bg-white/5 backdrop-blur-sm"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${
                    activeLink === link.path ? "w-8" : "w-0 group-hover:w-8"
                  }`}
                ></span>
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <Link
            to={"/hotel/login"}
            className="hidden md:flex items-center gap-4"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <button className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-2xl transition-all duration-300 shadow-xl group-hover:scale-105 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Login</span>
              </button>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/20">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                href={link.path}
                key={link.name}
                onClick={() => handleLinkClick(link.path)}
                className={`block w-full text-left py-4 px-6 rounded-2xl font-medium transition-all duration-300 ${
                  activeLink === link.path
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
                    : "text-white/80 hover:bg-white/10 hover:text-white border border-transparent"
                }`}
              >
                {link.name}
              </a>
            ))}

            <div className="pt-4 space-y-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75"></div>
                <Link to={'/hotel/login'} onClick={() => {
                  setIsMobileMenuOpen(false);
                }} className="relative w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;
