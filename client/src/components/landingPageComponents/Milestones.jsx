import {
  Calendar,
  ShoppingCart,
  TrendingUp,
  Users,
  Star,
  Sparkles,
} from "lucide-react";
import React from "react";

const milestones = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Launch Date",
    description: "Our platform officially went live.",
    color: "from-purple-500 to-blue-500",
    status: "completed",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "1K+ Menus Live",
    description: "Celebrated 5,000 active digital menus.",
    color: "from-blue-500 to-cyan-500",
    status: "completed",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Beta Analytics",
    description: "Launched beta version of our analytics tools.",
    color: "from-cyan-500 to-green-500",
    status: "completed",
  },
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    title: "Next: Ordering Integration",
    description: "Working on integrating a seamless ordering system.",
    color: "from-green-500 to-pink-500",
    status: "upcoming",
  },
];

const Milestones = () => {
  return (
    <>
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-ping"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-8">
              <Star className="w-4 h-4 text-purple-300 animate-pulse" />
              <span className="text-purple-300 font-medium">Our Journey</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Milestones Timeline
              </span>
            </h2>

            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              From launch to innovation, see how we're transforming the digital
              dining experience
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Animated timeline line */}
            <div className="absolute left-8 top-0 w-1 h-full bg-gradient-to-b from-purple-500 via-blue-500 via-cyan-500 to-pink-500 rounded-full shadow-lg"></div>
            <div className="absolute left-8 top-0 w-1 h-full bg-gradient-to-b from-purple-400 via-blue-400 via-cyan-400 to-pink-400 rounded-full animate-pulse blur-sm"></div>

            {milestones.map((milestone, index) => (
              <div key={index} className="mb-12 ml-20 relative group">
                {/* Milestone dot */}
                <div
                  className={`absolute -left-16 top-6 p-4 bg-gradient-to-r ${milestone.color} rounded-2xl text-white shadow-2xl transform group-hover:scale-110 transition-all duration-300`}
                >
                  <div className="relative z-10">{milestone.icon}</div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${milestone.color} rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                  ></div>
                </div>

                {/* Connection line */}
                <div className="absolute -left-12 top-8 w-8 h-0.5 bg-gradient-to-r from-white/20 to-transparent"></div>

                {/* Content card */}
                <div
                  className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl transform group-hover:scale-105 transition-all duration-300 ${
                    milestone.status === "upcoming"
                      ? "border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/5"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-white">
                      {milestone.title}
                    </h3>
                    {milestone.status === "upcoming" && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full border border-pink-500/30">
                        <Sparkles className="w-3 h-3 text-pink-300" />
                        <span className="text-pink-300 text-xs font-medium">
                          Coming Soon
                        </span>
                      </div>
                    )}
                    {milestone.status === "completed" && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className="text-white/80 text-lg leading-relaxed">
                    {milestone.description}
                  </p>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Be Part of Our Journey
              </h3>
              <p className="text-lg text-white/80 mb-6">
                Join thousands of restaurants already on the cutting edge of
                digital dining
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-xl">
                Start Your Digital Transformation
              </button>
            </div>
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
      </section>
    </>
  );
};

export default Milestones;
