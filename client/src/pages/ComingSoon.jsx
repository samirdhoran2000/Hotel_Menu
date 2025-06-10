import React, { useState } from "react";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
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

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium">
              Something Amazing is Brewing
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight block">
              Coming
            </span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight block mt-2">
              Soon
            </span>
          </h1>

          {/* Subtitle with glassmorphism */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-12 animate-fade-in-delay">
            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed mb-4">
              We're crafting the future of{" "}
              <span className="text-purple-300 font-semibold">
                restaurant dining
              </span>{" "}
              with revolutionary QR menu solutions.
            </p>
            <p className="text-lg text-white/70">
              Get ready for a{" "}
              <span className="text-pink-300 font-semibold">
                seamless, contactless experience
              </span>{" "}
              that will transform how customers interact with your menu.
            </p>
          </div>

          {/* Email subscription */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8 animate-fade-in-delay-2">
            <h3 className="text-xl font-semibold text-white mb-4">
              Be the First to Know
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <button
                onClick={handleSubscribe}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:scale-105 transform transition-all duration-300 hover:from-purple-500 hover:to-pink-500"
              >
                Notify Me
              </button>
            </div>
            {isSubscribed && (
              <div className="mt-4 text-green-300 font-medium animate-fade-in">
                🎉 Thanks! We'll notify you when we launch.
              </div>
            )}
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-delay-3">
            {[
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                ),
                title: "Instant QR Menus",
                description: "Generate beautiful QR code menus in seconds",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: "Lightning Fast",
                description: "Optimized for speed and seamless user experience",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
                title: "Secure & Reliable",
                description: "Enterprise-grade security with 99.9% uptime",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className="text-purple-400 mb-3">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 animate-fade delay-1200">
            {[
              { number: "10K+", label: "Restaurants Waiting" },
              { number: "500K+", label: "Expected Users" },
              { number: "50+", label: "Countries Ready" },
            ].map((stat, i) => (
              <div
                key={i}
                className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 hover:scale-105 transition-all duration-300"
              >
                <div className="text-3xl font-extrabold text-white group-hover:text-purple-300 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
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

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 1s ease-out 0.9s both;
        }

        .animate-fade-in-delay-4 {
          animation: fade-in 1s ease-out 1.2s both;
        }

        .animate-slide-up {
          animation: slide-up 1.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
