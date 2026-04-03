import { useState, useEffect } from "react";
import {
  Upload,
  X,
  Plus,
  AlertCircle,
  Check,
  ZoomIn,
  IndianRupee,
} from "lucide-react";

const MenuItemForm = ({ itemId, onClose, onSuccess }) => {
  const isEditing = Boolean(itemId);

  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    half_price: "",
    original_half_price: "",
    full_price: "",
    original_full_price: "",
    categoryId: "",
    ingredients: [],
    isVegetarian: false,
    available: true,
  });
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]); // newly selected files
  const [previews, setPreviews] = useState([]); // local data URLs for preview
  const [existingImages, setExistingImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [value, setValue] = useState(""); // for ingredient text input

  const [imagePreview, setImagePreview] = useState({
    isOpen: false,
    imageUrl: "",
    imageName: "",
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // If editing, fetch the item's details
  useEffect(() => {
    if (!isEditing) return;

    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/menu/${itemId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const response = await res.json();

        if (response.success && response.data && response.data.length > 0) {
          const result = response.data[0];
          setFormData({
            name: result.name || "",
            description: result.description || "",
            half_price: result.half_price || "",
            original_half_price: result.original_half_price || "",
            full_price: result.full_price || "",
            original_full_price: result.original_full_price || "",
            categoryId: result.categoryId || "",
            ingredients: Array.isArray(result.ingredients)
              ? result.ingredients
              : JSON.parse(result.ingredients || "[]"),
            isVegetarian: result.isVegetarian || false,
            available: result.available || false,
          });

          // Files from associations - Store both ID and URL
          setExistingImages(result.files ? result.files.map((f) => ({ id: f.id, url: f.url })) : []);

        }
      } catch (err) {
        console.error("Network error fetching item:", err);
      }
    };

    fetchItem();
  }, [isEditing, itemId]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (imagePreview.isOpen) {
          setImagePreview({ isOpen: false, imageUrl: "", imageName: "" });
        } else if (isOpen) {
          setIsOpen(false);
          onClose();
        }
      }
    };
    if (isOpen || imagePreview.isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, imagePreview.isOpen, onClose]);

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

  const removeIngredient = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, idx) => idx !== indexToRemove),
    }));
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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + existingImages.length > 5) {
      setErrors((prev) => ({
        ...prev,
        files: "Maximum 5 images allowed in total",
      }));
      return;
    }

    const validFiles = [...files];
    const newPreviews = [...previews];
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
        setPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    if (!hasError) {
      setFiles(validFiles);
      setErrors((prev) => ({ ...prev, files: null }));
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeExistingImage = (idToRemove) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== idToRemove));
  };


  const openImagePreview = (imageUrl, imageName = "Image") => {
    setImagePreview({ isOpen: true, imageUrl, imageName });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (
      !formData.half_price ||
      isNaN(formData.half_price) ||
      parseFloat(formData.half_price) < 0
    ) {
      newErrors.half_price = "Valid price is required";
    }
    if (
      !formData.full_price ||
      isNaN(formData.full_price) ||
      parseFloat(formData.full_price) < 0
    ) {
      newErrors.full_price = "Valid price is required";
    }
    if (existingImages.length + files.length === 0) {
      newErrors.files = "At least one image is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, val]) => {
        if (key === "ingredients") {
          formDataToSend.append(key, JSON.stringify(val));
        } else {
          formDataToSend.append(key, val);
        }
      });

      if (isEditing) {
        formDataToSend.append("keepImageIds", JSON.stringify(existingImages.map(img => img.id)));
      }


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
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: isEditing
            ? "Updated successfully!"
            : "Created successfully!",
        });
        setTimeout(() => {
          setIsSubmitting(false);
          onSuccess();
        }, 1000);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Failed to save",
        });
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitStatus({ type: "error", message: "Network error." });
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleClose}
          ></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
                  </h1>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {submitStatus && (
                <div
                  className={`mx-6 my-4 p-4 rounded-lg flex items-center gap-3 ${submitStatus.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}
                >
                  {submitStatus.type === "success" ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  {submitStatus.message}
                </div>
              )}

              <div className="p-6 space-y-6">
                {/* Images */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Images <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.url}
                          alt="Existing"
                          className="w-full h-32 object-cover rounded-lg border cursor-pointer"
                          onClick={() => openImagePreview(img.url)}
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {previews.map((preview, idx) => (
                      <div key={preview.id} className="relative group">
                        <img
                          src={preview.url}
                          alt="New"
                          className="w-full h-32 object-cover rounded-lg border"
                          onClick={() => openImagePreview(preview.url)}
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
                  {errors.files && (
                    <p className="text-red-500 text-sm">{errors.files}</p>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Half Price *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="half_price"
                        value={formData.half_price}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Half Price
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="original_half_price"
                        value={formData.original_half_price}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Price *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="full_price"
                        value={formData.full_price}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Full Price
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="original_full_price"
                        value={formData.original_full_price}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients
                  </label>
                  <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Press comma or enter to add"
                    className="w-full h-16 p-3 border border-gray-300 rounded-lg"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.ingredients.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeIngredient(idx)}
                          className="ml-2"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <span className="ml-2 text-sm">Vegetarian</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <span className="ml-2 text-sm">Available</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreview.isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={() => setImagePreview({ isOpen: false })}
        >
          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imagePreview.imageUrl}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setImagePreview({ isOpen: false })}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemForm;
