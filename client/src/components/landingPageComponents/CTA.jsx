import React from "react";
import { QrCode, Sparkles, ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <>
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500/5 rounded-full blur-2xl animate-ping"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
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

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-8">
            <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
            <span className="text-purple-300 font-medium">
              Start Your Digital Transformation
            </span>
          </div>

          {/* Main CTA Content */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Ready to Transform?
              </span>
            </h2>

            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of restaurants already revolutionizing their dining
              experience with digital menus
            </p>

            {/* Enhanced CTA Button */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <button className="relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold rounded-2xl transition-all duration-300 flex items-center gap-3 mx-auto group-hover:scale-105 shadow-2xl">
                <div className="p-2 bg-white/20 rounded-xl">
                  <QrCode className="w-6 h-6" />
                </div>
                <span>Generate Your Free QR Menu</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Free forever plan</span>
              </div>
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

export default CTA;
