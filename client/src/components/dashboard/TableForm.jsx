import { useState, useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";

const TableForm = ({ tableId, onClose, onSuccess }) => {
  const isEditing = Boolean(tableId);
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    tableNumber: "",
    qrCodeLink: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch existing table details when editing
  useEffect(() => {
    if (!isEditing) return;

    const fetchTable = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/table/${tableId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await res.json();
        if (res.ok) {
          const data = result.data;
          setFormData({
            tableNumber: data.tableNumber || "",
            qrCodeLink: data.qrCodeLink || "",
          });
        } else {
          console.error("Failed to fetch table:", result.message);
        }
      } catch (err) {
        console.error("Network error fetching table:", err);
      }
    };

    fetchTable();
  }, [isEditing, tableId]);

  // Close on Escape
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tableNumber.trim()) {
      newErrors.tableNumber = "Table number is required";
    }
    // if (!formData.qrCodeLink.trim()) {
    //   newErrors.qrCodeLink = "QR code link is required";
    // } else if (!/^https?:\/\/.+/i.test(formData.qrCodeLink)) {
    //   newErrors.qrCodeLink = "Valid URL is required";
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem("token");
      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/table/${tableId}`
        : `${import.meta.env.VITE_API_URL}/table`;
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: isEditing
            ? "Table updated successfully!"
            : "Table created successfully!",
        });
        setTimeout(() => {
          setIsSubmitting(false);
          onSuccess();
        }, 1000);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Failed to save table",
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

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          ></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative bg-white rounded-xl shadow-2xl  w-96 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? "Edit Table" : "Add New Table"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isEditing ? "Update table details" : "Create a new table"}
                  </p>
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

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1  gap-6">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hotel ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="hotelId"
                      value={formData.hotelId}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.hotelId ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter hotel ID"
                    />
                    {errors.hotelId && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.hotelId}
                      </p>
                    )}
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Table Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tableNumber"
                      value={formData.tableNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.tableNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g. A1, 10"
                    />
                    {errors.tableNumber && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.tableNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    name="qrCodeLink"
                    value={formData.qrCodeLink}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed ${
                      errors.qrCodeLink ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={`${import.meta.env.VITE_API_URL}/hotel/${tableId}`}
                  />
                  {errors.qrCodeLink && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.qrCodeLink}
                    </p>
                  )}
                </div>
              </div>

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
                      <Check className="w-4 h-4" />
                      {isEditing ? "Update Table" : "Create Table"}
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

export default TableForm;
