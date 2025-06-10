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
} from "lucide-react";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setGlobalError("");
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

    // Simulate API call
    setTimeout(() => {
      setSuccessMsg(
        "Hotel registered successfully! Welcome to the future of dining."
      );
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
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
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

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
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

            <h1 className="text-4xl sm:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight block">
                Register Your
              </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight block mt-2">
                Hotel Experience
              </span>
            </h1>
            <p className="text-white/70 text-lg font-light">
              Transform your restaurant with contactless dining solutions
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Status Messages */}
              {globalError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
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

              <div className="space-y-6">
                {/* Hotel Name */}
                <div className="group">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-white/90 mb-3"
                  >
                    Hotel Name <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User
                        className={`w-5 h-5 transition-colors ${
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
                      className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 placeholder-white/40 text-white ${
                        errors.name
                          ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                          : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                      } focus:outline-none focus:ring-4`}
                      placeholder="e.g. The Grand Plaza"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                      <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="group">
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold text-white/90 mb-3"
                  >
                    Address <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin
                        className={`w-5 h-5 transition-colors ${
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
                      className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 placeholder-white/40 text-white ${
                        errors.address
                          ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                          : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                      } focus:outline-none focus:ring-4`}
                      placeholder="e.g. 123 Main St, City, State"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.address && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                      <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="group">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-white/90 mb-3"
                  >
                    Description
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <FileText
                        className={`w-5 h-5 transition-colors ${
                          errors.description
                            ? "text-red-400"
                            : "text-white/40 group-focus-within:text-purple-400"
                        }`}
                      />
                    </div>
                    <textarea
                      name="description"
                      id="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 placeholder-white/40 text-white resize-none ${
                        errors.description
                          ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                          : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                      } focus:outline-none focus:ring-4`}
                      placeholder="Describe your hotel's unique features and amenities..."
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                      <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Website and Phone in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Website */}
                  <div className="group">
                    <label
                      htmlFor="website"
                      className="block text-sm font-semibold text-white/90 mb-3"
                    >
                      Website
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Globe
                          className={`w-5 h-5 transition-colors ${
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
                        className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 placeholder-white/40 text-white ${
                          errors.website
                            ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                            : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                        } focus:outline-none focus:ring-4`}
                        placeholder="https://www.yourhotel.com"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {errors.website && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                        {errors.website}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="group">
                    <label
                      htmlFor="phoneNo"
                      className="block text-sm font-semibold text-white/90 mb-3"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone
                          className={`w-5 h-5 transition-colors ${
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
                        className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 placeholder-white/40 text-white ${
                          errors.phoneNo
                            ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                            : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                        } focus:outline-none focus:ring-4`}
                        placeholder="+1 (555) 123-4567"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {errors.phoneNo && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                        {errors.phoneNo}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email and Date in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="group">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-white/90 mb-3"
                    >
                      Email <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail
                          className={`w-5 h-5 transition-colors ${
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
                        className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 placeholder-white/40 text-white ${
                          errors.email
                            ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                            : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                        } focus:outline-none focus:ring-4`}
                        placeholder="hotel@example.com"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Date of Establishment */}
                  <div className="group">
                    <label
                      htmlFor="dateOfEstablishment"
                      className="block text-sm font-semibold text-white/90 mb-3"
                    >
                      Date of Establishment
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar
                          className={`w-5 h-5 transition-colors ${
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
                        className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 placeholder-white/40 text-white ${
                          errors.dateOfEstablishment
                            ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                            : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                        } focus:outline-none focus:ring-4`}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {errors.dateOfEstablishment && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                        {errors.dateOfEstablishment}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="group">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-white/90 mb-3"
                  >
                    Password <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        className={`w-5 h-5 transition-colors ${
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
                      className={`w-full pl-12 pr-14 py-4 bg-white/5 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 placeholder-white/40 text-white ${
                        errors.password
                          ? "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                          : "border-white/10 focus:border-purple-400 focus:ring-purple-400/20 hover:border-white/20"
                      } focus:outline-none focus:ring-4`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/70 transition-colors"
                    >
                      {formData.showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                      <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`relative w-full px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl font-bold text-white transition-all duration-300 shadow-2xl ${
                        isSubmitting
                          ? "cursor-not-allowed opacity-70"
                          : "hover:scale-105 transform active:scale-95"
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="text-lg">Registering...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <Sparkles className="w-5 h-5" />
                          <span className="text-lg">Join the Revolution</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              Already part of the future?{" "}
              <button className="text-purple-300 hover:text-purple-200 font-semibold transition-colors relative group">
                <span className="relative z-10">Sign in here</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </button>
            </p>
          </div>

          {/* Floating stats */}
          <div className="flex justify-center gap-4 mt-12">
            {[
              { number: "50K+", label: "Hotels", icon: Hotel },
              { number: "2M+", label: "QR Scans", icon: Star },
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
        </div>
      </div>
    </div>
  );
}
