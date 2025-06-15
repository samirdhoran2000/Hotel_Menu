import { useState } from "react";
import {
  Eye,
  EyeOff,
  Hotel,
  Calendar,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Lock,
  User,
  Check,
  Star,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterHotel() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    website: "",
    phoneNo: "",
    email: "",
    dateOfEstablishment: "",
    password: "",
    showPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    // Hotel Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Hotel name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Hotel name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Hotel name must be less than 100 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (optional but if provided should be valid)
    if (formData.phoneNo.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = formData.phoneNo.replace(/[\s\-\(\)]/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phoneNo = "Please enter a valid phone number";
      }
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please provide a complete address";
    }

    // Website validation (optional but if provided should be valid)
    if (formData.website.trim()) {
      const urlRegex = /^https?:\/\/.+\..+/;
      if (!urlRegex.test(formData.website)) {
        newErrors.website =
          "Please enter a valid website URL (include http:// or https://)";
      }
    }

    // Date validation (optional but if provided should be valid)
    if (formData.dateOfEstablishment) {
      const selectedDate = new Date(formData.dateOfEstablishment);
      const today = new Date();
      const hundredYearsAgo = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
      );

      if (selectedDate > today) {
        newErrors.dateOfEstablishment = "Date cannot be in the future";
      } else if (selectedDate < hundredYearsAgo) {
        newErrors.dateOfEstablishment = "Date seems too old";
      }
    }

    // Description validation (optional but if provided should be reasonable)
    if (
      formData.description.trim() &&
      formData.description.trim().length > 1000
    ) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    return newErrors;
  };

  // API call function
  const registerHotel = async (hotelData) => {
    

    const response = await fetch(`${import.meta.env.VITE_API_URL}/hotel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(hotelData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    if (globalError) {
      setGlobalError("");
    }
  };

  const toggleShowPassword = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGlobalError("");
    setSuccessMsg("");
    setErrors({});

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for API call
      const hotelData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        address: formData.address.trim(),
        phoneNo: formData.phoneNo.trim() || null,
        website: formData.website.trim() || null,
        description: formData.description.trim() || null,
        dateOfEstablishment: formData.dateOfEstablishment || null,
      };

      // Make API call
      const response = await registerHotel(hotelData);

      // Handle success
      setSuccessMsg(
        response.message ||
          "Hotel registered successfully! Welcome to the future of dining."
      );

      // Reset form on success
      setFormData({
        name: "",
        address: "",
        description: "",
        website: "",
        phoneNo: "",
        email: "",
        dateOfEstablishment: "",
        password: "",
        showPassword: false,
      });

      // Optionally redirect after success
      setTimeout(() => {
        navigate('/hotel/login');
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);

      // Handle different types of errors
      if (
        error.message.includes("duplicate") ||
        error.message.includes("already exists")
      ) {
        setGlobalError(
          "A hotel with this email already exists. Please use a different email or try logging in."
        );
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        setGlobalError(
          "Network error. Please check your internet connection and try again."
        );
      } else if (error.message.includes("400")) {
        setGlobalError(
          "Invalid data provided. Please check your information and try again."
        );
      } else if (error.message.includes("500")) {
        setGlobalError("Server error. Please try again later.");
      } else {
        setGlobalError(
          error.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden mt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Header & Info */}
            <div className="lg:sticky lg:top-6">
              {/* Header */}
              <div className="text-center lg:text-left mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-all duration-300 relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl w-full h-full flex items-center justify-center">
                    <Hotel className="w-10 h-10 text-white" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span className="text-white/80 text-sm font-medium">
                    Join the Future of Hospitality
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                  <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight block">
                    Register Your
                  </span>
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight block mt-2">
                    Hotel Experience
                  </span>
                </h1>
                <p className="text-white/70 text-lg font-light mb-8">
                  Transform your restaurant with contactless dining solutions
                </p>
              </div>

              {/* Floating stats */}
              <div className="flex justify-center lg:justify-start gap-4 mb-8">
                {[
                  { number: "1K+", label: "Hotels", icon: Hotel },
                  { number: "10K+", label: "QR Scans", icon: Star },
                  { number: "99%", label: "Uptime", icon: Sparkles },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 text-center min-w-[100px]"
                  >
                    <stat.icon className="w-5 h-5 text-purple-300 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">
                      {stat.number}
                    </div>
                    <div className="text-white/60 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="text-center lg:text-left">
                <p className="text-white/60 text-sm">
                  Already part of the future?{" "}
                  <button className="text-purple-300 hover:text-purple-200 font-semibold transition-colors relative group">
                    <Link
                      to={"/hotel/login"}
                      className="relative z-10 text-white"
                    >
                      Sign in here
                    </Link>
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </button>
                </p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-6 sm:p-8">
                {/* Status Messages */}
                {globalError && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{globalError}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-300 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Hotel Name */}
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-white/90 mb-2"
                    >
                      Hotel Name <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User
                          className={`w-4 h-4 transition-colors ${
                            errors.name
                              ? "text-red-400"
                              : "text-white/40 group-focus-within:text-purple-400"
                          }`}
                        />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 bg-white/5 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 placeholder-white/40 text-white text-sm ${
                          errors.name
                            ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                            : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                        } focus:outline-none focus:ring-2`}
                        placeholder="e.g. The Grand Plaza"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email and Phone in Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="group">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-white/90 mb-2"
                      >
                        Email <span className="text-pink-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail
                            className={`w-4 h-4 transition-colors ${
                              errors.email
                                ? "text-red-400"
                                : "text-white/40 group-focus-within:text-purple-400"
                            }`}
                          />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-3 bg-white/5 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 placeholder-white/40 text-white text-sm ${
                            errors.email
                              ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                              : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                          } focus:outline-none focus:ring-2`}
                          placeholder="hotel@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="group">
                      <label
                        htmlFor="phoneNo"
                        className="block text-sm font-semibold text-white/90 mb-2"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone
                            className={`w-4 h-4 transition-colors ${
                              errors.phoneNo
                                ? "text-red-400"
                                : "text-white/40 group-focus-within:text-purple-400"
                            }`}
                          />
                        </div>
                        <input
                          type="tel"
                          name="phoneNo"
                          id="phoneNo"
                          value={formData.phoneNo}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-3 bg-white/5 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 placeholder-white/40 text-white text-sm ${
                            errors.phoneNo
                              ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                              : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                          } focus:outline-none focus:ring-2`}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      {errors.phoneNo && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phoneNo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="group">
                    <label
                      htmlFor="address"
                      className="block text-sm font-semibold text-white/90 mb-2"
                    >
                      Address <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin
                          className={`w-4 h-4 transition-colors ${
                            errors.address
                              ? "text-red-400"
                              : "text-white/40 group-focus-within:text-purple-400"
                          }`}
                        />
                      </div>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 bg-white/5 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 placeholder-white/40 text-white text-sm ${
                          errors.address
                            ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                            : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                        } focus:outline-none focus:ring-2`}
                        placeholder="e.g. 123 Main St, City, State"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Website and Date in Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Website */}
                    <div className="group">
                      <label
                        htmlFor="website"
                        className="block text-sm font-semibold text-white/90 mb-2"
                      >
                        Website
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe
                            className={`w-4 h-4 transition-colors ${
                              errors.website
                                ? "text-red-400"
                                : "text-white/40 group-focus-within:text-purple-400"
                            }`}
                          />
                        </div>
                        <input
                          type="url"
                          name="website"
                          id="website"
                          value={formData.website}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-3 bg-white/5 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 placeholder-white/40 text-white text-sm ${
                            errors.website
                              ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                              : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                          } focus:outline-none focus:ring-2`}
                          placeholder="https://www.yourhotel.com"
                        />
                      </div>
                      {errors.website && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.website}
                        </p>
                      )}
                    </div>

                    {/* Date of Establishment */}
                    <div className="group">
                      <label
                        htmlFor="dateOfEstablishment"
                        className="block text-sm font-semibold text-white/90 mb-2"
                      >
                        Date of Establishment
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar
                            className={`w-4 h-4 transition-colors ${
                              errors.dateOfEstablishment
                                ? "text-red-400"
                                : "text-white/40 group-focus-within:text-purple-400"
                            }`}
                          />
                        </div>
                        <input
                          type="date"
                          name="dateOfEstablishment"
                          id="dateOfEstablishment"
                          value={formData.dateOfEstablishment}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-3 bg-white/5 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 placeholder-white/40 text-white text-sm ${
                            errors.dateOfEstablishment
                              ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                              : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                          } focus:outline-none focus:ring-2`}
                        />
                      </div>
                      {errors.dateOfEstablishment && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.dateOfEstablishment}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="group">
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-white/90 mb-2"
                    >
                      Description
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FileText
                          className={`w-4 h-4 transition-colors ${
                            errors.description
                              ? "text-red-400"
                              : "text-white/40 group-focus-within:text-purple-400"
                          }`}
                        />
                      </div>
                      <textarea
                        name="description"
                        id="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 bg-white/5 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 placeholder-white/40 text-white text-sm resize-none ${
                          errors.description
                            ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                            : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                        } focus:outline-none focus:ring-2`}
                        placeholder="Describe your hotel's unique features..."
                      />
                    </div>
                    {errors.description && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="group">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-white/90 mb-2"
                    >
                      Password <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock
                          className={`w-4 h-4 transition-colors ${
                            errors.password
                              ? "text-red-400"
                              : "text-white/40 group-focus-within:text-purple-400"
                          }`}
                        />
                      </div>
                      <input
                        type={formData.showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 bg-white/5 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 placeholder-white/40 text-white text-sm ${
                          errors.password
                            ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                            : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                        } focus:outline-none focus:ring-2`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/70 transition-colors"
                      >
                        {formData.showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`relative w-full px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl font-bold text-white transition-all duration-300 shadow-2xl ${
                          isSubmitting
                            ? "cursor-not-allowed opacity-70"
                            : "hover:scale-105 transform active:scale-95"
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Registering...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <Sparkles className="w-4 h-4" />
                            <span>Join the Revolution</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
