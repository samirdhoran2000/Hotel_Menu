import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Hotel,
  Lock,
  Mail,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginHotel() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRememberMe(type === "checkbox" ? checked : rememberMe);
    setCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrorMsg("");
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => (!prev ));
  };

  const validateInputs = () => {
    if (!credentials.email.trim()) {
      setErrorMsg("Email address is required");
      return false;
    }
    if (!credentials.password) {
      setErrorMsg("Password is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      setErrorMsg("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    if (!validateInputs()) {
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 2000));

      

      const res = await fetch(`${import.meta.env.VITE_API_URL}/hotel/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        // 401 = invalid credentials, etc.
        setErrorMsg(data.message || "Invalid email or password");
      } else {
        // Successful login: store token & optionally redirect
        localStorage.setItem("token", data.token);
        // e.g. window.location.href = '/dashboard';
        setErrorMsg("");

        navigate("/hotel/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert("Comming soon, till you contact with us.");
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden pt-12">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen p-4 gap-8">
        {/* Left: Hero Section */}
        <div className="w-full lg:w-1/2 max-w-lg text-center lg:text-left">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl mb-6 shadow-2xl hover:scale-105 transition-transform duration-300 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-75 animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <Hotel className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Shield className="w-4 h-4 text-green-300" />
            <span className="text-white/80 text-sm font-medium">
              Secure Access Portal
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200 leading-tight">
              Welcome Back
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mt-2 leading-tight">
              to the Future
            </span>
          </h1>

          <p className="text-white/70 text-lg font-light mb-8">
            Access your hospitality dashboard with next-generation security
          </p>
        </div>

        {/* Right: Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Error Message */}
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm">{errorMsg}</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Email Field */}
                <div className="group">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-white/90 mb-2"
                  >
                    Email Address <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail
                        className={`w-5 h-5 transition-colors ${
                          errorMsg && !credentials.email
                            ? "text-red-400"
                            : "text-white/40 group-focus-within:text-purple-400"
                        }`}
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={credentials.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 placeholder-white/40 text-white focus:outline-none focus:ring-2 ${
                        errorMsg && !credentials.email
                          ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                          : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                      }`}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-white/90 mb-2"
                  >
                    Password <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        className={`w-5 h-5 transition-colors ${
                          errorMsg && !credentials.password
                            ? "text-red-400"
                            : "text-white/40 group-focus-within:text-purple-400"
                        }`}
                      />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={credentials.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-14 py-3 bg-white/5 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 placeholder-white/40 text-white focus:outline-none focus:ring-2 ${
                        errorMsg && !credentials.password
                          ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                          : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                      }`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/70 transition-colors duration-200 focus:outline-none"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={rememberMe}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                          rememberMe
                            ? "bg-purple-500 border-purple-500"
                            : "bg-white/5 border-white/20 group-hover:border-purple-400"
                        }`}
                      >
                        {rememberMe && (
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        )}
                      </div>
                    </div>
                    <span className="text-white/70 group-hover:text-white/90 transition-colors duration-200">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-purple-300 hover:text-purple-200 font-medium transition-colors relative group focus:outline-none"
                  >
                    <span className="relative z-10">Forgot password?</span>
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </button>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      onClick={handleLogin}
                      className={`relative w-full px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl font-bold text-white transition-all duration-300 shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 ${
                        isLoading
                          ? "cursor-not-allowed opacity-70"
                          : "hover:scale-105 transform active:scale-95"
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="text-lg">Accessing Portal...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <Zap className="w-5 h-5" />
                          <span className="text-lg">Enter the Future</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign Up Section */}
            <div className="px-6 sm:px-8 pb-6">
              <div className="text-center mb-6">
                <p className="text-white/60 text-sm">
                  New to the future of hospitality?{" "}
                  <Link to={'/hotel/registration'}
                    
                    className="text-white underline hover:text-purple-200 font-semibold transition-colors relative group focus:outline-none"
                  >
                    <span className="relative z-10">Join the revolution</span>
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                </p>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-4 mb-6">
                {[
                  { number: "24/7", label: "Support", icon: Shield },
                  { number: "256-bit", label: "Encryption", icon: Lock },
                  { number: "99.9%", label: "Uptime", icon: Sparkles },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3 hover:bg-white/10 transition-all duration-300 text-center min-w-[70px]"
                  >
                    <stat.icon className="w-3 h-3 text-purple-300 mx-auto mb-1" />
                    <div className="text-sm font-bold text-white">
                      {stat.number}
                    </div>
                    <div className="text-white/60 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Security Badge */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/60 text-xs">
                    Secure • Encrypted • Protected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
