import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  IndianRupee,
  Trash2,
  Eye,
  Grid3X3,
  List,
} from "lucide-react";
import MenuItemForm from "./MenuItemForm"; // we'll adapt this in the next section

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'grid' or 'table'

  const token = localStorage.getItem("token");
  // Fetch all menu items on mount (or whenever you want to re-load)
  const fetchMenuItems = async () => {
    try {
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

  const deleteMenuById = async (id) => {
    // Add confirmation dialog
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/menu/${id}`, {
        method: "DELETE", // Add DELETE method
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("Menu item deleted successfully.");
        // Refresh the menu items list after successful deletion
        fetchMenuItems();
      } else {
        alert(
          "Failed to delete menu item: " + (data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.log("Something went wrong deleting the menu:", error);
      alert("Network error occurred while deleting the menu item.");
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

  // Grid View Component
  const GridView = () => (
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
              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1 capitalize">
                {item.category?.name || "Uncategorized"}
              </p>
              <div className="mt-2">
                <span className="text-xl font-semibold text-gray-800 flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {item.half_price}
                </span>
                {item.original_half_price &&
                  item.original_half_price !== item.half_price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{item.original_half_price}
                    </span>
                  )}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEditModal(item.id)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => deleteMenuById(item.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
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
  );

  // Table View Component
  const TableView = () => (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
      {/* Table View (Desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-12 h-12 object-cover rounded-xl shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wider">
                    {item.category?.name || "Uncategorized"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm font-bold text-gray-900">
                    <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                    {item.half_price}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <button onClick={() => openEditModal(item.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 shadow-sm transition-all" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMenuById(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 shadow-sm transition-all" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {menuItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                  No menu items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card View (Mobile only replacements for Table) */}
      <div className="md:hidden divide-y divide-gray-100">
        {menuItems.map((item) => (
          <div key={item.id} className="p-4 flex gap-4 bg-white active:bg-gray-50 transition-colors">
            <div className="shrink-0">
              {item.images?.[0] ? (
                <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-2xl shadow-sm" />
              ) : (
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
                  <Eye className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 py-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-base font-bold text-gray-900 truncate pr-2">{item.name}</h3>
                <span className={`shrink-0 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  item.available ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                }`}>
                  {item.available ? "On" : "Off"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4 font-bold uppercase tracking-widest">{item.category?.name || "Uncategorized"}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-black text-gray-900 flex items-center">
                  <IndianRupee className="w-4 h-4 mr-0.5" />
                  {item.half_price}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(item.id)} className="p-2 sm:p-2.5 text-blue-600 bg-blue-50 rounded-xl active:scale-90 transition-all border border-blue-100">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteMenuById(item.id)} className="p-2 sm:p-2.5 text-red-600 bg-red-50 rounded-xl active:scale-90 transition-all border border-red-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {menuItems.length === 0 && (
          <div className="p-12 text-center text-gray-400 font-medium italic bg-gray-50/30">
            No items found.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-full px-4 md:px-8 py-6">
      {/* Header with Add Item button and View Toggle */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Menu Management</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Total {menuItems.length} Dishes</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle Buttons */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "grid" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" /> Grid
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 shadow-black/10"
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Render Grid or Table based on viewMode */}
      {viewMode === "grid" ? <GridView /> : <TableView />}

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
