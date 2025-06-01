// LoginHotel.jsx
import { useState } from "react";
// import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Hotel, Lock, Mail, User } from "lucide-react";

export default function LoginHotel() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [errorMsg, setErrorMsg] = useState(""); // login‐specific error
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const toggleShowPassword = () => {
    setCredentials((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    if (!credentials.email || !credentials.password) {
      setErrorMsg("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
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
        
          navigate("/hotel/dashboard")
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Internal server error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md">
        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl"></div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Hotel className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to your hotel account
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errorMsg}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 flex items-center"
              >
                <Mail size={16} className="mr-2 text-gray-500" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 bg-gray-50/50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                    errorMsg && !credentials.email
                      ? "border-red-300 bg-red-50/50"
                      : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 flex items-center"
              >
                <Lock size={16} className="mr-2 text-gray-500" />
                Password
              </label>
              <div className="relative">
                <input
                  type={credentials.showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 bg-gray-50/50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400 pr-12 ${
                    errorMsg && !credentials.password
                      ? "border-red-300 bg-red-50/50"
                      : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {credentials.showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-white shadow-lg transform transition-all duration-300 flex items-center justify-center space-x-2 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed scale-95"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Social Login */}
          {/* <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 group">
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Google
                </span>
              </button>

              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 group">
                <svg
                  className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Facebook
                </span>
              </button>
            </div>
          </div> */}

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{" "}
              <Link to={'/hotel/registration'} className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>Secure login • Protected by advanced encryption</p>
        </div>
      </div>
    </div>
  );
}
