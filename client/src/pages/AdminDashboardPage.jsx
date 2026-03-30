import { ArrowLeft, Copy, LogOut, Plus, QrCode, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiSend } from "../utils/api";
import { clearStoredAuth, getStoredAuth, setStoredAuth } from "../utils/config";
import { fileToBase64 } from "../utils/file";

const defaultItemForm = {
  id: "",
  name: "",
  price: "",
  originalPrice: "",
  rating: "4.2",
  categoryId: "",
  type: "veg",
  description: "",
  ingredients: "",
  isPopular: false,
  isTrending: false,
  imageBase64: "",
};

const AdminDashboardPage = ({ onBack, onProfileUpdated }) => {
  const auth = useMemo(() => getStoredAuth(), []);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [itemForm, setItemForm] = useState(defaultItemForm);

  const loadData = async () => {
    if (!auth?.token) {
      window.location.hash = "#/admin/login";
      return;
    }

    setLoading(true);
    try {
      const [settingsResponse, categoryResponse, itemResponse] = await Promise.all([
        apiGet("/api/settings", true),
        apiGet(`/api/category?hotelId=${encodeURIComponent(auth.admin.hotelId || auth.admin._id)}`),
        apiGet(`/api/item?hotelId=${encodeURIComponent(auth.admin.hotelId || auth.admin._id)}`),
      ]);
      setSettings(settingsResponse.settings);
      setCategories(categoryResponse);
      setItems(itemResponse);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const response = await apiSend("/api/settings", "PUT", settings, true);
      setSettings(response.settings);
      const stored = getStoredAuth();
      if (stored) {
        stored.admin = { ...stored.admin, ...response.settings };
        setStoredAuth(stored);
      }
      onProfileUpdated?.(response.settings);
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleRegenerateQr = async () => {
    try {
      const response = await apiSend("/api/settings/regenerate-qr", "POST", {}, true);
      setSettings((prev) => ({ ...prev, publicSlug: response.publicSlug, publicUrl: response.publicUrl }));
      const stored = getStoredAuth();
      if (stored) {
        stored.admin = { ...stored.admin, publicSlug: response.publicSlug };
        setStoredAuth(stored);
      }
      onProfileUpdated?.((prev) => ({ ...prev, publicSlug: response.publicSlug }));
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleItemSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...itemForm,
        ingredients: itemForm.ingredients,
      };
      if (itemForm.id) {
        await apiSend(`/api/item/${itemForm.id}`, "PUT", payload, true);
        setMessage("Menu item updated successfully");
      } else {
        await apiSend("/api/item", "POST", payload, true);
        setMessage("Menu item added successfully");
      }
      setItemForm(defaultItemForm);
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/item/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Delete failed");
      await loadData();
      setMessage(data.message || "Deleted successfully");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const startEdit = (item) => {
    setItemForm({
      id: item._id,
      name: item.name || "",
      price: item.price || "",
      originalPrice: item.originalPrice || "",
      rating: item.rating || "4.2",
      categoryId: item.categoryId || "",
      type: item.type === "nonveg" ? "non-veg" : item.type || "veg",
      description: item.description || "",
      ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(", ") : "",
      isPopular: Boolean(item.isPopular),
      isTrending: Boolean(item.isTrending),
      imageBase64: "",
    });
  };

  const copyPublicUrl = async () => {
    if (!settings?.publicUrl) return;
    await navigator.clipboard.writeText(settings.publicUrl);
    setMessage("Public URL copied");
  };

  const logout = () => {
    clearStoredAuth();
    window.location.hash = "#/admin/login";
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-lg font-semibold text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-3">
                <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                  <ArrowLeft className="h-4 w-4" />
                  Back to public page
                </button>
              </div>
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Admin Dashboard</p>
              <h1 className="mt-2 text-4xl font-black text-slate-900">{settings?.hotelName || auth?.admin?.hotelName}</h1>
              <p className="mt-2 text-sm text-slate-600">Professional admin layout with connected forms, categories, items, and QR flow.</p>
            </div>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {message ? <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">{message}</div> : null}

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-900">Hotel profile</p>
                  <p className="text-sm text-slate-500">Update hotel info, about, address, and public base URL.</p>
                </div>
                <button onClick={handleSaveProfile} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                  <Save className="h-4 w-4" /> Save
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Hotel Name
                  <input value={settings?.hotelName || ""} onChange={(event) => setSettings({ ...settings, hotelName: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Admin Name
                  <input value={settings?.adminName || ""} onChange={(event) => setSettings({ ...settings, adminName: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Phone
                  <input value={settings?.phone || ""} onChange={(event) => setSettings({ ...settings, phone: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Alt Phone
                  <input value={settings?.altPhone || ""} onChange={(event) => setSettings({ ...settings, altPhone: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                  Address
                  <textarea rows={3} value={settings?.address || ""} onChange={(event) => setSettings({ ...settings, address: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                  About Hotel
                  <textarea rows={4} value={settings?.about || ""} onChange={(event) => setSettings({ ...settings, about: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                  Public Base URL
                  <input value={settings?.publicBaseUrl || ""} onChange={(event) => setSettings({ ...settings, publicBaseUrl: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                </label>
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-900">Menu items</p>
                  <p className="text-sm text-slate-500">Add, edit, or delete menu items with image upload to server/uploads.</p>
                </div>
              </div>

              <form onSubmit={handleItemSubmit} className="grid gap-4 rounded-[28px] bg-slate-50 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-semibold text-slate-700">
                    Item Name
                    <input value={itemForm.name} onChange={(event) => setItemForm({ ...itemForm, name: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-700">
                    Category
                    <select value={itemForm.categoryId} onChange={(event) => setItemForm({ ...itemForm, categoryId: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400">
                      <option value="">Select category</option>
                      {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-700">
                    Price
                    <input type="number" value={itemForm.price} onChange={(event) => setItemForm({ ...itemForm, price: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-700">
                    Original Price
                    <input type="number" value={itemForm.originalPrice} onChange={(event) => setItemForm({ ...itemForm, originalPrice: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-700">
                    Rating
                    <input type="number" step="0.1" value={itemForm.rating} onChange={(event) => setItemForm({ ...itemForm, rating: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-700">
                    Type
                    <select value={itemForm.type} onChange={(event) => setItemForm({ ...itemForm, type: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400">
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non Veg</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                    Description
                    <textarea rows={3} value={itemForm.description} onChange={(event) => setItemForm({ ...itemForm, description: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                    Ingredients
                    <input value={itemForm.ingredients} onChange={(event) => setItemForm({ ...itemForm, ingredients: event.target.value })} placeholder="Paneer, Butter, Cream" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                    Item Image
                    <input type="file" accept="image/*" onChange={async (event) => setItemForm({ ...itemForm, imageBase64: await fileToBase64(event.target.files?.[0]) })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-400" />
                  </label>
                </div>
                <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={itemForm.isPopular} onChange={(event) => setItemForm({ ...itemForm, isPopular: event.target.checked })} /> Popular</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={itemForm.isTrending} onChange={(event) => setItemForm({ ...itemForm, isTrending: event.target.checked })} /> Trending</label>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> {itemForm.id ? "Update item" : "Add item"}</button>
                  {itemForm.id ? <button type="button" onClick={() => setItemForm(defaultItemForm)} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Cancel edit</button> : null}
                </div>
              </form>

              <div className="mt-6 space-y-3">
                {items.map((item) => (
                  <div key={item._id} className="flex flex-col gap-4 rounded-[24px] border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.categoryName || "No category"} . ₹{item.price}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.description || "No description"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => startEdit(item)} className="rounded-full border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-700">Edit</button>
                      <button onClick={() => handleDeleteItem(item._id)} className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"><Trash2 className="h-4 w-4" /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-2xl font-black text-slate-900">Categories</p>
              <p className="mt-2 text-sm text-slate-500">All, Popular, and Trending work in public page. Regular categories are managed here.</p>
              <div className="mt-5 grid gap-3">
                {categories.map((category) => (
                  <div key={category._id} className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="font-semibold text-slate-900">{category.name}</p>
                    <p className="text-sm text-slate-500">Order {category.sortOrder || 0}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-900">QR & Public Link</p>
                  <p className="mt-2 text-sm text-slate-500">Uses PUBLIC_BASE_URL. Localhost is avoided for QR sharing.</p>
                </div>
                <button onClick={handleRegenerateQr} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"><QrCode className="h-4 w-4" /> Regenerate</button>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm break-all text-slate-700">{settings?.publicUrl || "No public URL"}</div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={copyPublicUrl} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"><Copy className="h-4 w-4" /> Copy</button>
                <a href={settings?.publicUrl} target="_blank" rel="noreferrer" className="rounded-full border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-700">Open public page</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
