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
} from "lucide-react";
import { Link } from "react-router-dom";

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

    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      description: formData.description.trim(),
      website: formData.website.trim(),
      phoneNo: formData.phoneNo.trim(),
      email: formData.email.trim(),
      dateOfEstablishment: formData.dateOfEstablishment,
      password: formData.password,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hotel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.errors) {
          const fieldErrors = {};
          data.errors.forEach((errObj) => {
            fieldErrors[errObj.field] = errObj.message;
          });
          setErrors(fieldErrors);
        } else if (res.status === 409) {
          setGlobalError(data.message || "Hotel already exists");
        } else {
          setGlobalError(data.message || "Something went wrong.");
        }
      } else {
        setSuccessMsg("Hotel registered successfully! You can now log in.");
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
      }
    } catch (err) {
      console.error("Registration error:", err);
      setGlobalError("Internal server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-200">
            <Hotel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Register Your Hotel
          </h1>
          <p className="text-gray-600 text-lg">
            Join our platform and reach more guests
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Status Messages */}
            {globalError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-sm">{globalError}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hotel Name */}
              <div className="group">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Hotel Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User
                      className={`w-5 h-5 transition-colors ${
                        errors.name
                          ? "text-red-400"
                          : "text-gray-400 group-focus-within:text-blue-500"
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder-gray-400 text-gray-900 ${
                      errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-300"
                    } focus:outline-none focus:ring-4`}
                    placeholder="e.g. The Grand Plaza"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="group">
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin
                      className={`w-5 h-5 transition-colors ${
                        errors.address
                          ? "text-red-400"
                          : "text-gray-400 group-focus-within:text-blue-500"
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder-gray-400 text-gray-900 ${
                      errors.address
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-300"
                    } focus:outline-none focus:ring-4`}
                    placeholder="e.g. 123 Main St, City, State"
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="group">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Description
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <FileText
                      className={`w-5 h-5 transition-colors ${
                        errors.description
                          ? "text-red-400"
                          : "text-gray-400 group-focus-within:text-blue-500"
                      }`}
                    />
                  </div>
                  <textarea
                    name="description"
                    id="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder-gray-400 text-gray-900 resize-none ${
                      errors.description
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-300"
                    } focus:outline-none focus:ring-4`}
                    placeholder="A brief description of your hotel's unique features and amenities..."
                  />
                </div>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
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
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe
                        className={`w-5 h-5 transition-colors ${
                          errors.website
                            ? "text-red-400"
                            : "text-gray-400 group-focus-within:text-blue-500"
                        }`}
                      />
                    </div>
                    <input
                      type="url"
                      name="website"
                      id="website"
                      value={formData.website}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder-gray-400 text-gray-900 ${
                        errors.website
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-300"
                      } focus:outline-none focus:ring-4`}
                      placeholder="https://www.yourhotel.com"
                    />
                  </div>
                  {errors.website && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      {errors.website}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="group">
                  <label
                    htmlFor="phoneNo"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone
                        className={`w-5 h-5 transition-colors ${
                          errors.phoneNo
                            ? "text-red-400"
                            : "text-gray-400 group-focus-within:text-blue-500"
                        }`}
                      />
                    </div>
                    <input
                      type="tel"
                      name="phoneNo"
                      id="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder-gray-400 text-gray-900 ${
                        errors.phoneNo
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-300"
                      } focus:outline-none focus:ring-4`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phoneNo && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
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
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail
                        className={`w-5 h-5 transition-colors ${
                          errors.email
                            ? "text-red-400"
                            : "text-gray-400 group-focus-within:text-blue-500"
                        }`}
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder-gray-400 text-gray-900 ${
                        errors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-300"
                      } focus:outline-none focus:ring-4`}
                      placeholder="hotel@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Date of Establishment */}
                <div className="group">
                  <label
                    htmlFor="dateOfEstablishment"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Date of Establishment
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar
                        className={`w-5 h-5 transition-colors ${
                          errors.dateOfEstablishment
                            ? "text-red-400"
                            : "text-gray-400 group-focus-within:text-blue-500"
                        }`}
                      />
                    </div>
                    <input
                      type="date"
                      name="dateOfEstablishment"
                      id="dateOfEstablishment"
                      value={formData.dateOfEstablishment}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder-gray-400 text-gray-900 ${
                        errors.dateOfEstablishment
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-300"
                      } focus:outline-none focus:ring-4`}
                    />
                  </div>
                  {errors.dateOfEstablishment && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      {errors.dateOfEstablishment}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className={`w-5 h-5 transition-colors ${
                        errors.password
                          ? "text-red-400"
                          : "text-gray-400 group-focus-within:text-blue-500"
                      }`}
                    />
                  </div>
                  <input
                    type={formData.showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder-gray-400 text-gray-900 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100 hover:border-gray-300"
                    } focus:outline-none focus:ring-4`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {formData.showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full relative px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-200 shadow-lg ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Registering...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Hotel className="w-5 h-5" />
                      Register Hotel
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            to={'/hotel/login'}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
