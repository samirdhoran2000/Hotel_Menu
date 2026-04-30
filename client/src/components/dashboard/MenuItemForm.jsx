import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import {
  Upload,
  X,
  Plus,
  AlertCircle,
  Check,
  ZoomIn,
  IndianRupee,
  Loader2,
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
    isVegetarian: true,
    available: true,
  });
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]); // newly selected files
  const [previews, setPreviews] = useState([]); // local data URLs for preview
  const [existingImages, setExistingImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [value, setValue] = useState(""); // for ingredient text input

  const [imagePreview, setImagePreview] = useState({
    isOpen: false,
    imageUrl: "",
    imageName: "",
  });

  // --- Quick Add Category States ---
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("veg");
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");

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
            isVegetarian: result.isVegetarian ?? true,
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
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Auto-set isVegetarian if category changes
      if (name === "categoryId" && value) {
        const selectedCat = categories.find((c) => c.id === parseInt(value));
        if (selectedCat) {
          newData.isVegetarian = selectedCat.type === "veg";
        }
      }

      return newData;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + existingImages.length > 5) {
      setErrors((prev) => ({
        ...prev,
        files: "Maximum 5 images allowed in total",
      }));
      return;
    }

    setIsCompressing(true);
    setErrors((prev) => ({ ...prev, files: null }));

    const compressionOptions = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      initialQuality:0.7,
      fileType: "image/webp"
    };

    const validFiles = [...files];
    const newPreviews = [...previews];
    let hasError = false;

    try {
      for (const file of selectedFiles) {
        if (!file.type.startsWith("image/")) {
          setErrors((prev) => ({
            ...prev,
            files: "Only image files are allowed",
          }));
          hasError = true;
          continue;
        }

        // Apply compression only if file is > 500KB
        let compressedFile = file;
        if (file.size > 500 * 1024) {
          try {
            console.log(`Compressing ${file.name} - Original size: ${file.size / 1024 / 1024} MB`);
            compressedFile = await imageCompression(file, compressionOptions);
            console.log(`Compressed ${file.name} - New size: ${compressedFile.size / 1024 / 1024} MB`);
            // Preserve the original name in the compressed blob
            compressedFile = new File([compressedFile], file.name, { type: file.type });
          } catch (compressionError) {
            console.error("Compression failed, using original:", compressionError);
          }
        } else {
          console.log(`Skipping compression for ${file.name} (size: ${file.size / 1024} KB)`);
        }

        validFiles.push(compressedFile);

        // Generate preview for the compressed file
        const previewUrl = await imageCompression.getDataUrlFromFile(compressedFile);
        newPreviews.push({
          id: Math.random().toString(36).substr(2, 9),
          url: previewUrl,
          name: file.name,
        });
      }

      if (!hasError) {
        setFiles(validFiles);
        setPreviews([...newPreviews]);
      }
    } catch (err) {
      console.error("File processing error:", err);
      setErrors((prev) => ({ ...prev, files: "Error processing some images" }));
    } finally {
      setIsCompressing(false);
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
      formData.half_price &&
      (isNaN(formData.half_price) || parseFloat(formData.half_price) < 0)
    ) {
      newErrors.half_price = "Valid price is required if provided";
    }
    if (
      !formData.full_price ||
      isNaN(formData.full_price) ||
      parseFloat(formData.full_price) < 0
    ) {
      newErrors.full_price = "Valid price is required";
    }
    // Image validation removed to make upload optional
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

  const handleQuickAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError("Category name is required");
      return;
    }

    setIsSavingCategory(true);
    setCategoryError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name: newCategoryName.trim(),
          type: newCategoryType 
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local categories list
        setCategories((prev) => [...prev, data.data]);
        // Select the new category
        setFormData((prev) => ({ ...prev, categoryId: data.data.id }));
        // Reset states
        setNewCategoryName("");
        setNewCategoryType("veg");
        setIsAddingCategory(false);
      } else {
        setCategoryError(data.message || "Failed to add category");
      }
    } catch (err) {
      console.error("Error adding quick category:", err);
      setCategoryError("Network error.");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while saving
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
                  disabled={isSubmitting}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Loading Overlay - Fixed to viewport to prevent scrolling */}
              {isSubmitting && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-300">
                  <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border border-gray-100 max-w-sm w-full mx-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
                      <Loader2 className="w-16 h-16 text-blue-600 animate-spin absolute inset-0" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900">Saving Changes</h3>
                      <p className="text-sm text-gray-500">Please wait while we update your menu...</p>
                    </div>
                  </div>
                </div>
              )}

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

              <div className={`p-6 space-y-6 ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
                {/* Images */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Images
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
                    <label 
                      className={`inline-flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium ${isCompressing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isCompressing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>{isCompressing ? "Optimizing..." : "Choose Better Images"}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isCompressing}
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
                    <div className="flex items-center gap-2">
                      {isAddingCategory ? (
                          <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="New category name"
                                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${categoryError ? "border-red-500" : "border-gray-300"}`}
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={handleQuickAddCategory}
                                disabled={isSavingCategory}
                                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                title="Save Category"
                              >
                                {isSavingCategory ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <Check className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingCategory(false);
                                  setCategoryError("");
                                }}
                                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                                title="Cancel"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="flex gap-4 px-1">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name="newCategoryType"
                                  value="veg"
                                  checked={newCategoryType === "veg"}
                                  onChange={(e) => setNewCategoryType(e.target.value)}
                                  className="w-3.5 h-3.5 text-blue-600"
                                />
                                <span className="text-xs text-gray-600 font-medium">Veg</span>
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name="newCategoryType"
                                  value="non-veg"
                                  checked={newCategoryType === "non-veg"}
                                  onChange={(e) => setNewCategoryType(e.target.value)}
                                  className="w-3.5 h-3.5 text-blue-600"
                                />
                                <span className="text-xs text-gray-600 font-medium">Non-Veg</span>
                              </label>
                            </div>
                          </div>
                      ) : (
                        <>
                          <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleInputChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setIsAddingCategory(true)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200 transition"
                            title="Add New Category"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                    {categoryError && (
                      <p className="text-red-500 text-xs mt-1">{categoryError}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Half Price
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
                      checked={!formData.isVegetarian}
                      onChange={(e) => handleInputChange({ target: { name: 'isVegetarian', type: 'checkbox', checked: !e.target.checked } })}
                      className="rounded"
                    />
                    <span className="ml-2 text-sm">Non-Vegetarian</span>
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
                  disabled={isSubmitting}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : isEditing ? "Update" : "Create"}
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
