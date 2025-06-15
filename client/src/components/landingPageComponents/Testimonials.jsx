import React from "react";
import { Quote, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

const testimonials = [
  {
    quote:
      "EasyMenu has revolutionized how we present our menu. It's incredibly easy to use and our customers love the convenience!",
    author: "Amol Chopade",
    position: "Owner, Changbhale Cafe",
  },
  {
    quote:
      "Switching to EasyMenu was a game-changer. Updating specials is now a breeze, and the cost savings on printing are significant.",
    author: "Gaurav Wankhede",
    position: "Manager, Sarthi International",
  },
];

const Testimonials = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-900 to-purple-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-6">
              <Users className="w-4 h-4 text-purple-300" />
              <span className="text-purple-300 font-medium">
                Success Stories
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                What Our Users
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Say
              </span>
            </h2>

            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Real experiences from restaurant owners who&apos;ve transformed
              their business with EasyMenu
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-500 overflow-hidden"
              >
                {/* Gradient overlay for hover state */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 p-8 group-hover:scale-[1.02] transition-transform duration-300">
                  {/* Quote Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                      <div className="relative p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                        <Quote className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Quote Text */}
                  <p className="text-lg text-white/80 mb-8 leading-relaxed text-center italic group-hover:text-white/90 transition-colors duration-300">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author Info */}
                  <div className="text-center">
                    <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <p className="font-bold text-xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300 mb-2">
                      {testimonial.author}
                    </p>

                    <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                      {testimonial.position}
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div className="flex justify-center mt-6 gap-1">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="w-4 h-4 text-yellow-400 fill-current opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          animationDelay: `${starIndex * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Corner accents */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { number: "1K+", label: "Happy Restaurants" },
              { number: "98%", label: "Customer Satisfaction" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-white/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Join thousands of satisfied restaurant owners
              </h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Experience the EasyMenu difference and see why restaurants
                worldwide trust us with their digital menu needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={"/hotel/registration"}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-white hover:scale-105 transform transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <span className="relative">Start Your Free Menu</span>
                </Link>
                <a
                  href="/#contact"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-2xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  View More Reviews
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.6);
          }
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default Testimonials;
