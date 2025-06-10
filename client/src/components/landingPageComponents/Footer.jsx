import { BarChart3 } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl animate-ping"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-5 py-10">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6 text-center md:text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  MenuCard
                </h2>
              </div>
              <nav className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm">
                <a
                  href="#"
                  className="text-white/70 hover:text-white font-medium transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-white/70 hover:text-white font-medium transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-white/70 hover:text-white font-medium transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
                >
                  Contact Us
                </a>
              </nav>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

            <p className="text-center text-sm text-white/60">
              © 2024 MenuCard. All rights reserved.
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </footer>
    </>
  );
};

export default Footer;
