import { useState, useEffect } from "react";
import { Plus, Edit2, IndianRupee } from "lucide-react";
import MenuItemForm from "./MenuItemForm"; // we’ll adapt this in the next section

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  // Fetch all menu items on mount (or whenever you want to re-load)
  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
        const data = await res.json();
        
        
      if (res.ok) {
        setMenuItems(data?.data?.menuItems);
      } else {
        console.error("Failed to fetch menu items:", data.message);
      }
    } catch (err) {
      console.error("Network error fetching menu items:", err);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const openCreateModal = () => {
    setEditingItemId(null);
    setIsFormOpen(true);
  };

  const openEditModal = (id) => {
    setEditingItemId(id);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setEditingItemId(null);
  };

  // After creating or updating, re-fetch the list
  const handleSaveSuccess = () => {
    closeModal();
    fetchMenuItems();
  };

  return (
    <div className="max-w-full px-8 py-6">
      {/* Header + "Add Item" button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Menu Management
        </h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Menu Item
        </button>
      </div>

      {/* Grid/List of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
          >
            {/* Thumbnail (first image) */}
            {item.images && item.images.length > 0 && (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
            )}

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 capitalize">
                  {item.category.replace("_", " ")}
                </p>
                <div className="mt-2">
                  <span className="text-xl font-semibold text-gray-800">
                    <IndianRupee className="w-4 h-4"/>{item.half_price}
                  </span>
                  {item.original_half_price &&
                    item.original_half_price !== item.half_price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${item.original_half_price}
                      </span>
                    )}
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => openEditModal(item.id)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                {item.available ? (
                  <span className="text-green-600 text-sm">Available</span>
                ) : (
                  <span className="text-red-600 text-sm">Unavailable</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {menuItems.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No menu items found.
          </p>
        )}
      </div>

      {/* Modal: reuse MenuItemForm (passing editingItemId) */}
      {isFormOpen && (
        <MenuItemForm
          itemId={editingItemId} // if null, treat as "create"
          onClose={closeModal}
          onSuccess={handleSaveSuccess} // called after successful create/update
        />
      )}
    </div>
  );
};

export default MenuManager;
