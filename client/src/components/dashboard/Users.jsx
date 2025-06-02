import {
  BarChart3,
  X,
  User,
  Mail,
  Phone,
  Lock,
  UserCheck,
  ChefHat,
  Calendar,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";

const Users = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const result = await response.json();
      setUsers(result?.data || []);
    } catch (e) {
      console.error("Failed to fetch users:", e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Callback after a user is successfully added
  const handleUserAdded = (newUser) => {
    // Option A: re-fetch entire list
    fetchUsers();

    // Or Option B: append directly:
    // setUsers((prev) => [...prev, newUser]);
  };

  // Compute stats for the header
  const totalStaff = users.length;
  const totalAdmins = users.filter((u) => u.role === "hotel_admin").length;
  const totalKitchen = users.filter((u) => u.role === "hotel_kitchen").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hotel Staff Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and view your hotel team members with their roles and contact
            information.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Page title + Add User button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Users Management
            </h2>
            <p className="text-gray-600">Manage your users and permissions.</p>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <UserCheck className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-3xl font-bold text-gray-900">{totalStaff}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Administrators
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalAdmins}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Kitchen Staff
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalKitchen}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <ChefHat className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* User Cards Grid */}
        {users.length === 0 ? (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
            No users found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <UserCard key={user.id} data={user} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <AddUserDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

const AddUserDialog = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
    role: "hotel_admin", // default matches one of the roles array
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const roles = [
    { value: "hotel_admin", label: "Admin" },
    { value: "hotel_kitchen", label: "Kitchen" },
    // you can add other roles here if needed
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.phoneNo && !/^\+?[\d\s-()]+$/.test(formData.phoneNo)) {
      newErrors.phoneNo = "Please enter a valid phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          phoneNo: "",
          role: "hotel_admin",
        });
        setErrors({});

        // Notify parent
        onUserAdded(result.data);
        onClose();
        alert("User created successfully!");
      } else {
        if (result.errors) {
          const fieldErrors = {};
          result.errors.forEach((error) => {
            fieldErrors[error.field] = error.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: result.message || "Failed to create user" });
        }
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        email: "",
        password: "",
        phoneNo: "",
        role: "hotel_admin",
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            Add New User
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter full name"
                disabled={loading}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter email address"
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter password"
                disabled={loading}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phoneNo ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter phone number"
                disabled={loading}
              />
            </div>
            {errors.phoneNo && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNo}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserCard = ({ data }) => {
  const getRoleConfig = (role) => {
    switch (role) {
      case "hotel_admin":
        return {
          label: "Admin",
          icon: Shield,
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          borderColor: "border-purple-200",
        };
      case "hotel_kitchen":
        return {
          label: "Kitchen Staff",
          icon: ChefHat,
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          borderColor: "border-orange-200",
        };
      default:
        return {
          label: role,
          icon: User,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPhoneNumber = (phone) => {
    if (phone && phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone || "-";
  };

  const roleConfig = getRoleConfig(data.role);
  const RoleIcon = roleConfig.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white bg-opacity-20 p-2 rounded-full">
            <User className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
            ID: {data.id}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-1 capitalize">{data.name}</h3>
        <p className="text-blue-100 text-sm">Hotel ID: {data.hotelId}</p>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4">
        {/* Role Badge */}
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleConfig.bgColor} ${roleConfig.textColor} border ${roleConfig.borderColor}`}
        >
          <RoleIcon className="w-4 h-4 mr-2" />
          {roleConfig.label}
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-3 text-blue-500" />
            <span className="text-sm truncate">{data.email}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-3 text-green-500" />
            <span className="text-sm">{formatPhoneNumber(data.phoneNo)}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-3 text-purple-500" />
            <span className="text-sm">Joined {formatDate(data.createdAt)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-100">
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
