import { Link } from "react-router-dom";


const WhyWeExist = () => {
  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
      id="why-we-exist"
    >
      {/* Modern Features Section */}
      <div className="relative bg-gradient-to-b from-slate-900 to-black py-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-6">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-300 font-medium">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Experience the Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Restaurant Technology
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Revolutionary QR menu solutions that transform dining experiences
              and streamline operations
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: "🚀",
                title: "Instant Setup",
                description:
                  "Get your QR menu live in under 5 minutes with our intuitive platform",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: "📱",
                title: "Mobile Optimized",
                description:
                  "Perfect experience on every device with lightning-fast loading",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: "🔄",
                title: "Real-time Updates",
                description:
                  "Update menus instantly across all locations without reprinting",
                color: "from-pink-500 to-orange-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 animate-float"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}
                ></div>
                <div className="relative z-10">
                  <div
                    className="text-4xl mb-4 animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive demo section */}
          <div className="bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center animate-glow">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Ready to Transform Your Restaurant?
                </span>
              </h3>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Join thousands of restaurants already using our platform to
                create seamless dining experiences
              </p>

              {/* Demo buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/#contact"
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-white hover:scale-105 transform transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-4a3 3 0 013-3h0a3 3 0 013 3v4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    View Live Demo
                  </span>
                </a>

                <a
                  href="/#contact"
                  className="group px-8 py-4 bg-white/10 backdrop-blur-sm rounded-2xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Talk to Sales
                  </span>
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex justify-center gap-8 mt-12 opacity-60">
                {[
                  "Trusted by 1K+ restaurants",
                  "99.9% uptime guarantee",
                  "24/7 support",
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-white/60"
                  >
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyWeExist;
