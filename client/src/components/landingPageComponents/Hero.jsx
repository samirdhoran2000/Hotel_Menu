import React from "react";

import heroImage from "../../assets/Hero_Image.webp";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden py-2">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main content - Two column layout */}
      <div className="relative z-10 flex items-center min-h-screen px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column - Content */}{" "}
            <div className="flex items-center justify-center lg:justify-end animate-fade-in-delay">
              <div className="relative w-full max-w-lg lg:max-w-xl">
                {/* Placeholder for image with glassmorphism effect */}
                <div className="aspect-square bg-white/5 backdrop-blur-md rounded-3xl border border-white/20 p-8 hover:bg-white/10 transition-all duration-500 group">
                  {/* Image placeholder content */}
             
                      <img src={heroImage} alt="Hero Image" className="rounded-2xl"/>
                    
                </div>

                {/* Decorative elements around image */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-60 animate-pulse delay-1000"></div>
              </div>
            </div>
            {/* Right column - Image container */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-fade-in">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm font-medium">
                  Revolutionizing Dining Experience
                </span>
              </div>

              {/* Main heading with gradient */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 animate-slide-up">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight block">
                  Our Story:
                </span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight block mt-2">
                  Simplifying Restaurant Menus,
                </span>
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight block mt-2">
                  Table by Table
                </span>
              </h1>

              {/* Subtitle with glassmorphism */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 lg:p-8 mb-8 animate-fade-in-delay">
                <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                  Born from a passion for{" "}
                  <span className="text-purple-300 font-semibold">
                    contactless dining
                  </span>{" "}
                  and
                  <span className="text-blue-300 font-semibold">
                    {" "}
                    operational ease
                  </span>
                  .
                  <br />
                  <span className="text-pink-300">
                    Transforming how restaurants connect with their customers.
                  </span>
                </p>
              </div>

              {/* CTA Button with hover effects */}
              <div className="relative group mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <Link to={'/hotel/registration'} className="relative px-8 py-4 lg:px-12 lg:py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl leading-none flex items-center divide-x divide-gray-600 hover:scale-105 transform transition-all duration-300">
                  <span className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 lg:w-6 lg:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z"
                      />
                    </svg>
                    <span className="text-white text-lg lg:text-xl font-bold">
                      Generate Free QR
                    </span>
                  </span>
                  <span className="pl-4 lg:pl-6 text-white/80 group-hover:text-white transition-colors">
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* Floating stats */}
              <div className="flex flex-wrap gap-4 lg:gap-6 animate-fade-in-delay-2">
                {[
                  { number: "1K+", label: "Restaurants" },
                  { number: "10K+", label: "QR Scans" },
                  { number: "99%", label: "Uptime" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3 lg:p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="text-xl lg:text-2xl font-bold text-white">
                      {stat.number}
                    </div>
                    <div className="text-white/60 text-xs lg:text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes tilt {
          0%,
          50%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }

        .animate-slide-up {
          animation: slide-up 1.2s ease-out;
        }

        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Hero;
