import React, { useState, useEffect } from "react";
import { Upload, X, Plus, DollarSign, AlertCircle, Check } from "lucide-react";

const MenuItemForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    category: "",
    ingredients: [],
    isVegetarian: false,
    available: true,
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const [value, setValue] = useState("");

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const tokens = value
        .split(/,|\n/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (tokens.length > 0) {
        const lastToken = tokens[tokens.length - 1];

        if (!formData.ingredients.includes(lastToken)) {
          setFormData((prev) => ({
            ...prev,
            ingredients: [...prev.ingredients, lastToken],
          }));
        }
      }

      setValue("");
    }
  };

  const categories = [
    { name: "appetizer", label: "Appetizers" },
    { name: "main_course", label: "Main Course" },
    { name: "desserts", label: "Desserts" },
    { name: "beverages", label: "Beverages" },
    { name: "snacks", label: "Snacks" },
    { name: "salads", label: "Salads" },
    { name: "soups", label: "Soups" },
    { name: "others", label: "Others" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      setErrors((prev) => ({ ...prev, files: "Maximum 5 images allowed" }));
      return;
    }

    const validFiles = [];
    const newPreviews = [];
    let hasError = false;

    selectedFiles.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          files: "Only image files are allowed",
        }));
        hasError = true;
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          files: "Each image must be less than 5MB",
        }));
        hasError = true;
        return;
      }

      validFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push({
          id: Math.random().toString(36).substr(2, 9),
          url: e.target.result,
          name: file.name,
        });

        if (newPreviews.length === validFiles.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });

    if (!hasError) {
      setFiles(validFiles);
      setErrors((prev) => ({ ...prev, files: null }));
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Valid price is required";
    }
    if (
      !formData.original_price ||
      isNaN(formData.original_price) ||
      parseFloat(formData.original_price) <= 0
    ) {
      newErrors.original_price = "Valid original price is required";
    }
    if (files.length === 0) newErrors.files = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitStatus({
        type: "success",
        message: "Menu item created successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        original_price: "",
        category: "",
        ingredients: [],
        isVegetarian: false,
        available: true,
      });
      setFiles([]);
      setPreviews([]);
      setValue("");

      // Close modal after success
      setTimeout(() => {
        setIsOpen(false);
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    // Clear any temporary states when closing
    setSubmitStatus(null);
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Menu Item
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeModal}
          ></div>

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content */}
              <div className="p-6">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center border-b pb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Add New Menu Item
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Create a new menu item with images and details
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {submitStatus && (
                  <div
                    className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                      submitStatus.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    {submitStatus.message}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Images <span className="text-red-500">*</span>
                    </label>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Choose Images
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Upload up to 5 images (max 5MB each)
                        </p>
                      </div>
                    </div>

                    {errors.files && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.files}
                      </p>
                    )}

                    {/* Image Previews */}
                    {previews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {previews.map((preview, index) => (
                          <div key={preview.id} className="relative group">
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter menu item name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.name} value={category.name}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.price ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="number"
                          name="original_price"
                          value={formData.original_price}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.original_price
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.original_price && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.original_price}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your menu item..."
                    />
                  </div>

                  {/* Ingredients */}
                  <div>
                    <label
                      htmlFor="comma-input"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Ingredients (press "," or Enter to add)
                    </label>
                    <textarea
                      id="comma-input"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. apple, banana, cherry,…"
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.ingredients.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {formData.ingredients.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Checkboxes */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isVegetarian"
                        checked={formData.isVegetarian}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Vegetarian
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Available
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Create Menu Item
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemForm;
