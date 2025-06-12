import React from "react";

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      category: "Innovation",
      title: "The Future of Contactless Dining: QR Codes Revolution",
      excerpt:
        "Discover how QR code technology is transforming restaurant operations and customer experiences in the post-pandemic world.",
      author: "Sarah Chen",
      date: "June 8, 2025",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop&crop=center",
      featured: false,
    },
    {
      id: 2,
      category: "Success Story",
      title: "How Bella Vista Increased Orders by 300% with Digital Menus",
      excerpt:
        "A case study on how one restaurant transformed their business using our QR menu platform.",
      author: "Mike Rodriguez",
      date: "June 5, 2025",
      readTime: "8 min read",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop&crop=center",
    },
    {
      id: 3,
      category: "Technology",
      title: "Behind the Scenes: Building Scalable Restaurant Tech",
      excerpt:
        "An inside look at the technology stack powering thousands of restaurant operations worldwide.",
      author: "Alex Kim",
      date: "June 3, 2025",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop&crop=center",
    },
    {
      id: 4,
      category: "Industry Trends",
      title: "Restaurant Analytics: Data-Driven Decision Making",
      excerpt:
        "Learn how successful restaurants use data analytics to optimize their menu offerings and increase revenue.",
      author: "Emma Watson",
      date: "May 30, 2025",
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center",
    },
    {
      id: 5,
      category: "Tips & Tricks",
      title: "10 Best Practices for Digital Menu Design",
      excerpt:
        "Essential design principles to create menus that convert browsers into buyers and enhance user experience.",
      author: "David Park",
      date: "May 28, 2025",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1586999768815-66dcb5c541c0?w=400&h=250&fit=crop&crop=center",
    },
    {
      id: 6,
      category: "Customer Focus",
      title: "Understanding Modern Diners: What They Really Want",
      excerpt:
        "Research insights into customer preferences and behaviors that are shaping the restaurant industry.",
      author: "Lisa Thompson",
      date: "May 25, 2025",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=250&fit=crop&crop=center",
    },
  ];

  const categories = [
    "All",
    "Innovation",
    "Success Story",
    "Technology",
    "Industry Trends",
    "Tips & Tricks",
    "Customer Focus",
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium">
              Latest Insights
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Restaurant
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Industry Blog
            </span>
          </h2>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 max-w-3xl mx-auto">
            <p className="text-xl text-white/90 font-light">
              Stay ahead with the latest trends, insights, and success stories
              from the{" "}
              <span className="text-purple-300 font-semibold">
                restaurant technology
              </span>{" "}
              world
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-delay">
          {categories.map((category, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                i === 0
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/20 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-delay-2">
          {blogPosts.map((post, i) => (
            <article
              key={post.id}
              className={`group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-purple-400/30 ${
                post.featured ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : ""
              }`}
              style={{
                animation: `fade-in 0.8s ease-out ${i * 0.1}s both`,
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                    post.featured ? "h-64" : "h-48"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              <div
                className={`p-6 ${post.featured ? "space-y-4" : "space-y-3"}`}
              >
                <h3
                  className={`font-bold text-white group-hover:text-purple-300 transition-colors ${
                    post.featured
                      ? "text-xl leading-tight"
                      : "text-lg leading-tight"
                  }`}
                >
                  {post.title}
                </h3>

                <p
                  className={`text-white/70 leading-relaxed ${
                    post.featured ? "text-base" : "text-sm"
                  }`}
                >
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-white/90 text-sm font-medium">
                        {post.author}
                      </p>
                      <p className="text-white/60 text-xs">{post.date}</p>
                    </div>
                  </div>
                  <span className="text-purple-300 text-xs font-medium">
                    {post.readTime}
                  </span>
                </div>

                <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl text-white font-medium hover:from-purple-600/30 hover:to-pink-600/30 hover:border-purple-400/50 transition-all duration-300 group-hover:translate-y-[-2px]">
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16 animate-fade-in-delay-3">
          <div className="relative group inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <button className="relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl text-white font-bold hover:scale-105 transform transition-all duration-300">
              Load More Articles
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
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
      `}</style>
    </div>
  );
};

export default Blogs;
