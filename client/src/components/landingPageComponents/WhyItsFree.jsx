import React from "react";
import { Heart, Zap, Shield, Crown, Gift, Users } from "lucide-react";

const WhyItsFree = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-20 left-1/4 w-6 h-6 border-2 border-emerald-400 rounded-full animate-bounce"></div>
        <div
          className="absolute bottom-32 right-1/3 w-4 h-4 bg-teal-400 rotate-45 animate-spin"
          style={{ animationDuration: "8s" }}
        ></div>
        <div className="absolute top-1/3 right-20 w-8 h-8 border-2 border-cyan-400 rotate-12 animate-pulse"></div>
      </div>

      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30 mb-6">
              <Gift className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span className="text-emerald-300 font-medium">Our Promise</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
                Why It's
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                100% Free
              </span>
            </h2>

            <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
              We believe every restaurant deserves access to premium digital
              menu technology
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl mb-12">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Side - Main Message */}
              <div className="p-12 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      Our Mission
                    </h3>
                    <p className="text-emerald-200 text-lg">
                      Making technology accessible to all
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h4 className="text-xl font-bold text-white mb-3">
                      Ad-Supported Model
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                      Our platform is powered by carefully selected,
                      non-intrusive advertisements that allow us to provide
                      premium features at no cost to restaurants.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h4 className="text-xl font-bold text-white mb-3">
                      Democratizing Technology
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                      We believe that every restaurant, from food trucks to fine
                      dining establishments, should have access to modern
                      digital menu solutions.
                    </p>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-300">
                      50K+
                    </div>
                    <div className="text-white/70">Restaurants Served</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-300">$0</div>
                    <div className="text-white/70">Setup Costs</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Benefits */}
              <div className="p-12">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">
                  What You Get For Free
                </h3>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Zap className="w-6 h-6" />,
                      title: "Lightning Fast Setup",
                      description:
                        "Get your digital menu live in under 5 minutes with zero technical knowledge required.",
                      color: "from-yellow-500 to-orange-500",
                    },
                    {
                      icon: <Users className="w-6 h-6" />,
                      title: "Unlimited Menu Items",
                      description:
                        "Add as many dishes, categories, and customizations as you need without restrictions.",
                      color: "from-blue-500 to-purple-500",
                    },
                    {
                      icon: <Shield className="w-6 h-6" />,
                      title: "Real-time Updates",
                      description:
                        "Instantly update prices, availability, and descriptions across all your locations.",
                      color: "from-green-500 to-emerald-500",
                    },
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                        >
                          {benefit.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-2">
                            {benefit.title}
                          </h4>
                          <p className="text-white/70 leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Upgrade Section */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-4">
                Want An Ad-Free Experience?
              </h3>

              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Upgrade to Easymenu Pro for an completely ad-free experience
                with additional premium features and priority support.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-white hover:scale-105 transform transition-all duration-300 overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Upgrade to Pro
                  </span>
                </button>

                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-2xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300">
                  Learn More About Pro
                </button>
              </div>

              {/* Pro Features Preview */}
              <div className="flex justify-center space-x-8 mt-8 text-sm text-white/60">
                {[
                  "No Ads",
                  "Advanced Analytics",
                  "Priority Support",
                  "Custom Branding",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Section */}
          <div className="text-center mt-16">
            <p className="text-white/60 text-lg mb-4">
              Trusted by restaurants worldwide
            </p>
            <div className="flex justify-center space-x-6 opacity-40">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-white/20 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyItsFree;
