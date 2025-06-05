import { useState, useEffect } from "react";
import { Upload, X, Plus, DollarSign, AlertCircle, Check } from "lucide-react";

const MenuItemForm = ({ itemId, onClose, onSuccess }) => {
  const isEditing = Boolean(itemId);

  const [isOpen, setIsOpen] = useState(true);
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
  const [files, setFiles] = useState([]); // newly selected files
  const [previews, setPreviews] = useState([]); // local data URLs for preview
  const [existingImages, setExistingImages] = useState([]);
  // when editing, these are the URLs already stored on server
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [value, setValue] = useState(""); // for ingredient text input

  // CATEGORY OPTIONS:
  const categories = [
    { name: "appetizer", label: "Appetizers" },
    { name: "main_course", label: "Main Course" },
    { name: "dessert", label: "Desserts" },
    { name: "beverage", label: "Beverages" },
    { name: "snack", label: "Snacks" },
    { name: "salad", label: "Salads" },
    { name: "soup", label: "Soups" },
    { name: "other", label: "Others" },
  ];

  // 1️⃣ If editing, fetch the item’s details on mount:
  useEffect(() => {
    if (!isEditing) return;

    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/menu/${itemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const responce = await res.json();
        console.log("Fetched item details:", responce);
        
        const result = responce.data[0];
        if (res.ok) {
          // Populate formData
          setFormData({
            name: result.name || "",
            description: result.description || "",
            price: result.price || "",
            original_price: result.original_price || "",
            category: result.category || "",
            ingredients: Array.isArray(result.ingredients)
              ? result.ingredients
              : JSON.parse(result.ingredients || "[]"),
            isVegetarian: result.isVegetarian || false,
            available: result.available || false,
          });

          // Keep track of “existingImages” so we display them for preview/edit
          setExistingImages(Array.isArray(result.images) ? result.images : []);
        } else {
          console.error("Failed to fetch item:", result.message);
        }
      } catch (err) {
        console.error("Network error fetching item:", err);
      }
    };

    fetchItem();
  }, [isEditing, itemId]);

  // 2️⃣ Close modal on Escape:
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // 3️⃣ Handle comma/enter for ingredients:
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

  // 4️⃣ File handling (same as before):
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
      reader.onload = (ev) => {
        newPreviews.push({
          id: Math.random().toString(36).substr(2, 9),
          url: ev.target.result,
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

  // Remove a newly selected file before submit:
  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Remove an existing image (only when editing):
  const removeExistingImage = (urlToRemove) => {
    setExistingImages((prev) => prev.filter((url) => url !== urlToRemove));
  };

  // 5️⃣ Validate before submit:
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
    // If creating → require at least one file. If editing → allow existingImages to count.
    const totalImagesCount = existingImages.length + files.length;
    if (totalImagesCount === 0) {
      newErrors.files = "At least one image is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 6️⃣ On form submit (create vs update):
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Append all fields
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "ingredients") {
          formDataToSend.append(key, JSON.stringify(val));
        } else {
          formDataToSend.append(key, val);
        }
      });

      // If editing, tell backend which existing images to keep:
      if (isEditing) {
        // assuming your backend expects a JSON array of URLs to KEEP
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }

      // Append new files (if any)
      files.forEach((file) => {
        formDataToSend.append("files", file);
      });

      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/menu/${itemId}`
        : `${import.meta.env.VITE_API_URL}/menu`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
          // IMPORTANT: do NOT set Content-Type; let browser set multi-part boundary
        },
      });

      const result = await response.json();
      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: isEditing
            ? "Menu item updated successfully!"
            : "Menu item created successfully!",
        });
        // Brief delay so user sees “success”
        setTimeout(() => {
          setIsSubmitting(false);
          onSuccess();
        }, 1000);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Failed to save menu item",
        });
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  // 7️⃣ Close button
  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleClose}
          ></div>

          {/* Centered Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isEditing
                      ? "Update your menu item details"
                      : "Create a new menu item with images and details"}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Status Message */}
              {submitStatus && (
                <div
                  className={`mx-6 my-4 p-4 rounded-lg flex items-center gap-3 ${
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

              {/* Form Body */}
              <div className="p-6 space-y-6">
                {/* — Images Section — */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Images <span className="text-red-500">*</span>
                  </label>

                  {/* Show existing images (if editing) */}
                  {isEditing && existingImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {existingImages.map((url) => (
                        <div key={url} className="relative group">
                          <img
                            src={url}
                            alt="Existing"
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(url)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload new files */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
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

                  {/* Preview of newly selected files */}
                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {previews.map((preview, idx) => (
                        <div key={preview.id} className="relative group">
                          <img
                            src={preview.url}
                            alt={preview.name}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* — Basic Info: Name & Category — */}
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
                      {categories.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* — Pricing — */}
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

                {/* — Description — */}
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

                {/* — Ingredients — */}
                <div>
                  <label
                    htmlFor="comma-input"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ingredients (press “,” or Enter to add)
                  </label>
                  <textarea
                    id="comma-input"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. apple, banana, cherry,…"
                    className="w-full h-16 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                {/* — Checkboxes: Vegetarian, Available — */}
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
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 p-6 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      {isEditing ? "Update Menu Item" : "Create Menu Item"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemForm;
