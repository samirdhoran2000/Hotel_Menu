import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "Is Easymenu really free? How do you make money?",
    answer:
      "Yes, our core digital menu service is completely free for restaurant owners. We generate revenue through unobtrusive ads displayed on the menu. We also offer premium ad-free options and advanced features for a subscription fee.",
  },
  {
    question: "Can I customize the look of my digital menu?",
    answer:
      "Absolutely! You can upload your logo, choose theme colors, and organize your menu items and categories to match your restaurant's branding. Our goal is to provide a seamless experience for your customers.",
  },
  {
    question: "Do you offer analytics for menu performance?",
    answer:
      "Yes, we provide basic analytics that show you how many times your menu has been viewed. Our premium plans offer more detailed insights, such as popular items and peak viewing times, to help you optimize your offerings.",
  },
  {
    question: "What kind of customer support do you provide?",
    answer:
      "We offer email support for all users. Premium subscribers have access to priority support, including live chat options. We also have a comprehensive knowledge base and tutorials to help you get started and make the most of Easymenu.",
  },
  {
    question: "As a customer, do I need to download an app to view the menu?",
    answer:
      "No app download is required! Simply scan the QR code provided by the restaurant with your smartphone's camera, and the digital menu will open directly in your web browser. It's quick, easy, and convenient.",
  },
];

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-900 to-purple-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
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

      <div className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-6">
              <HelpCircle className="w-4 h-4 text-purple-300" />
              <span className="text-purple-300 font-medium">
                Got Questions?
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Frequently Asked
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>

            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about Easymenu and how it can
              transform your restaurant's digital presence.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`group relative bg-white/5 backdrop-blur-xl rounded-3xl border transition-all duration-500 overflow-hidden ${
                  openFaq === index
                    ? "border-purple-500/50 bg-white/10"
                    : "border-white/10 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                {/* Gradient overlay for active state */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 transition-opacity duration-500 ${
                    openFaq === index ? "opacity-100" : ""
                  }`}
                ></div>

                <div className="relative z-10 p-8">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex items-center justify-between w-full text-left cursor-pointer group-hover:scale-[1.01] transition-transform duration-300"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-3 h-3 rounded-full mt-2 transition-all duration-300 ${
                          openFaq === index
                            ? "bg-gradient-to-r from-purple-400 to-pink-400"
                            : "bg-white/20 group-hover:bg-white/40"
                        }`}
                      ></div>
                      <span
                        className={`font-bold text-lg md:text-xl transition-colors duration-300 ${
                          openFaq === index
                            ? "bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent"
                            : "text-white group-hover:text-purple-200"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>

                    <div
                      className={`ml-4 p-2 rounded-full transition-all duration-300 ${
                        openFaq === index
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-white/10 group-hover:bg-white/20"
                      }`}
                    >
                      <ChevronDown
                        className={`w-5 h-5 text-white transform transition-transform duration-300 ${
                          openFaq === index ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      openFaq === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="flex items-start gap-4">
                        <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                        <p className="text-white/80 leading-relaxed text-lg">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Still have questions?
              </h3>
              <p className="text-white/70 mb-6">
                Our support team is ready to help you get started with Easymenu
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-white hover:scale-105 transform transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <span className="relative">Contact Support</span>
                </button>
                <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300">
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default FAQ;
