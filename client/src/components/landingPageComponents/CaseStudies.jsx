import React, { useState } from "react";
import {
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign,
  Star,
} from "lucide-react";

const caseStudies = [
  {
    name: "Luigi's Trattoria",
    subtitle: "Authentic Italian Dining",
    logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop",
    challenge:
      "Struggled with frequent menu updates for seasonal specials and managing high printing costs for paper menus.",
    solution:
      "Implemented MenuCard's digital QR menus, allowing instant updates to specials and eliminating printing expenses.",
    outcomes: [
      "Reduced annual printing costs by over $1,200.",
      "Improved customer experience with always up-to-date menus.",
      "Increased flexibility in offering daily and weekly specials.",
    ],
    metrics: {
      savings: "$1,200+",
      efficiency: "90%",
      satisfaction: "4.8/5",
    },
    color: "from-orange-500 to-red-500",
  },
  {
    name: "The Corner Bistro",
    subtitle: "Modern Cafe & Eatery",
    logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=80&h=80&fit=crop",
    challenge:
      "Wanted to provide a more hygienic, contactless menu solution post-pandemic, and reduce staff time spent on sanitizing physical menus.",
    solution:
      "Adopted MenuCard for a fully digital menu accessible via QR codes on each table.",
    outcomes: [
      "Enhanced guest safety and satisfaction with contactless menus.",
      "Freed up staff time previously spent on menu cleaning.",
      "Positive customer feedback on the ease of use and modern approach.",
    ],
    metrics: {
      savings: "3hrs/day",
      efficiency: "95%",
      satisfaction: "4.9/5",
    },
    color: "from-blue-500 to-purple-500",
  },
];

const CaseStudies = () => {
  const [activeStudy, setActiveStudy] = useState(0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
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

      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-6">
              <Star className="w-4 h-4 text-purple-300 animate-pulse" />
              <span className="text-purple-300 font-medium">
                Success Stories
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Case Studies
              </span>
            </h2>

            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Real restaurants, real results. See how MenuCard transforms dining
              experiences.
            </p>
          </div>

          {/* Interactive Case Study Selector */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-2">
              {caseStudies.map((study, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStudy(index)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeStudy === index
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {study.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Case Study Display */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Left Side - Company Info */}
                <div className="p-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                  <div className="flex items-center mb-8">
                    <img
                      src={caseStudies[activeStudy].logo}
                      alt={`${caseStudies[activeStudy].name} Logo`}
                      className="w-20 h-20 rounded-2xl mr-6 object-cover shadow-xl border-2 border-white/20"
                    />
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {caseStudies[activeStudy].name}
                      </h3>
                      <p className="text-purple-200 text-lg">
                        {caseStudies[activeStudy].subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                      <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {caseStudies[activeStudy].metrics.savings}
                      </div>
                      <div className="text-sm text-white/70">Saved</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                      <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {caseStudies[activeStudy].metrics.efficiency}
                      </div>
                      <div className="text-sm text-white/70">Efficiency</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                      <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {caseStudies[activeStudy].metrics.satisfaction}
                      </div>
                      <div className="text-sm text-white/70">Rating</div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30">
                    <div className="text-4xl text-purple-300 mb-2">"</div>
                    <p className="text-white/90 text-lg leading-relaxed italic">
                      MenuCard transformed our operations completely. The ease
                      of updates and cost savings exceeded our expectations.
                    </p>
                    <div className="mt-4 flex items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      <span className="text-purple-200 font-medium">
                        Restaurant Owner
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Challenge, Solution, Outcomes */}
                <div className="p-12 space-y-8">
                  {/* Challenge */}
                  <div className="group">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">!</span>
                      </div>
                      <h4 className="text-2xl font-bold text-white">
                        Challenge
                      </h4>
                    </div>
                    <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/20">
                      <p className="text-white/80 leading-relaxed text-lg">
                        {caseStudies[activeStudy].challenge}
                      </p>
                    </div>
                  </div>

                  {/* Solution */}
                  <div className="group">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-2xl font-bold text-white">
                        Solution
                      </h4>
                    </div>
                    <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20">
                      <p className="text-white/80 leading-relaxed text-lg">
                        {caseStudies[activeStudy].solution}
                      </p>
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="group">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-2xl font-bold text-white">Results</h4>
                    </div>
                    <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/20">
                      <ul className="space-y-3">
                        {caseStudies[activeStudy].outcomes.map(
                          (outcome, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-white/80 leading-relaxed text-lg">
                                {outcome}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to write your own success story?
              </h3>
              <p className="text-xl text-white/80 mb-6">
                Join hundreds of restaurants already transforming their
                operations
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-xl">
                Start Your Transformation
              </button>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default CaseStudies;
