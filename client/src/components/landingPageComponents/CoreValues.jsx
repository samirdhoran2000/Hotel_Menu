import { Accessibility, Lightbulb, Shield, Sparkles } from "lucide-react";
import React from "react";

const coreValues = [
  {
    icon: <Accessibility className="w-12 h-12" />,
    title: "Accessibility",
    description: "Free & easy for all.",
    highlight:
      "Everyone deserves access to great restaurant technology, regardless of budget or technical expertise.",
  },
  {
    icon: <Lightbulb className="w-12 h-12" />,
    title: "Innovation",
    description: "Continuous improvements—search, filter, analytics.",
    highlight:
      "We're constantly pushing boundaries with cutting-edge features that stay ahead of industry trends.",
  },
  {
    icon: <Shield className="w-12 h-12" />,
    title: "Transparency",
    description: "No hidden fees; ads fund our service.",
    highlight:
      "Complete honesty in our business model means you always know exactly what you're getting.",
  },
];

const CoreValues = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-900 to-purple-900 overflow-hidden">
      {/* Dynamic background with moving elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Geometric shapes for visual interest */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div
          className="absolute top-1/4 right-10 w-20 h-20 border-2 border-purple-400 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div className="absolute bottom-1/3 left-10 w-16 h-16 border-2 border-pink-400 rotate-12 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping"></div>
      </div>

      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Centered Header with Side Elements */}
          <div className="relative text-center mb-20">
            {/* Side decorative elements */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
            </div>

            <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-lg rounded-full border border-purple-500/50 mb-8 shadow-2xl">
              <Sparkles className="w-5 h-5 text-purple-200 animate-pulse" />
              <span className="text-purple-100 font-semibold text-lg">
                Our Foundation
              </span>
            </div>

            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                Core
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mt-2">
                Values
              </span>
            </h2>

            <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
              The principles that drive everything we do at MenuCard
            </p>
          </div>

          {/* Zigzag Layout for Values */}
          <div className="space-y-20">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Icon Side */}
                <div className="flex-1 flex justify-center lg:justify-start">
                  <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-500 scale-110"></div>

                    {/* Main icon container */}
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 group-hover:scale-105 transition-all duration-500 shadow-2xl">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl">
                        {value.icon}
                      </div>

                      {/* Floating number */}
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-10 hover:bg-white/15 transition-all duration-500 shadow-2xl">
                    <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      {value.title}
                    </h3>

                    <p className="text-xl text-purple-200 font-semibold mb-6 leading-relaxed">
                      {value.description}
                    </p>

                    <p className="text-lg text-white/70 leading-relaxed">
                      {value.highlight}
                    </p>

                    {/* Progress bar decoration */}
                    <div className="mt-8">
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"
                          style={{ width: `${70 + index * 15}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Section with Different Layout */}
          <div className="mt-24">
            <div className="relative bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 backdrop-blur-2xl rounded-3xl border border-purple-500/30 overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20"></div>
                <div className="absolute top-4 left-4 w-8 h-8 border-2 border-purple-400 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-pink-400 rotate-45"></div>
              </div>

              <div className="relative z-10 text-center p-12">
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  Built on these principles
                </h3>
                <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  Every feature, every decision, and every interaction is guided
                  by our commitment to accessibility, innovation, and
                  transparency.
                </p>

                {/* Decorative elements */}
                <div className="flex justify-center space-x-8 mt-8">
                  {["Accessibility", "Innovation", "Transparency"].map(
                    (principle, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-2"></div>
                        <span className="text-sm text-white/60 font-medium">
                          {principle}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoreValues;
