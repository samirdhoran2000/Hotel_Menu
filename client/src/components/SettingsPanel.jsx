import { Copy, ExternalLink, QrCode, Save, Shield, Tag, UserCircle2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiSend } from "../utils/api";
import { getStoredAuth, setStoredAuth } from "../utils/config";

const tabs = [
  { id: "profile", name: "Hotel Info", icon: UserCircle2 },
  { id: "categories", name: "Categories", icon: Tag },
  { id: "qr", name: "QR & Link", icon: QrCode },
  { id: "security", name: "Password", icon: Shield },
];

const emptyPasswordState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const SettingsPanel = ({ isOpen, onClose, onProfileUpdated }) => {
  const auth = useMemo(() => getStoredAuth(), [isOpen]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", sortOrder: 0, editId: "" });
  const [passwordForm, setPasswordForm] = useState(emptyPasswordState);

  const loadData = async () => {
    if (!auth?.token) return;
    setLoading(true);
    try {
      const [settingsResponse, categoryResponse] = await Promise.all([
        apiGet("/api/settings", true),
        apiGet(`/api/category?hotelId=${encodeURIComponent(auth.admin.hotelId || auth.admin._id)}`),
      ]);
      setSettings(settingsResponse.settings);
      setCategories(categoryResponse);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && auth?.token) {
      loadData();
    }
  }, [isOpen]);

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      const response = await apiSend("/api/settings", "PUT", settings, true);
      setSettings(response.settings);
      const stored = getStoredAuth();
      if (stored?.admin) {
        stored.admin = { ...stored.admin, ...response.settings };
        setStoredAuth(stored);
      }
      onProfileUpdated?.(response.settings);
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async () => {
    try {
      if (!categoryForm.name.trim()) {
        setMessage("Category name is required");
        return;
      }
      setLoading(true);
      if (categoryForm.editId) {
        await apiSend(`/api/category/${categoryForm.editId}`, "PUT", categoryForm, true);
      } else {
        await apiSend("/api/category", "POST", categoryForm, true);
      }
      setCategoryForm({ name: "", description: "", sortOrder: 0, editId: "" });
      await loadData();
      setMessage("Category saved successfully");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setLoading(true);
      await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/category/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }).then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Delete failed");
      });
      await loadData();
      setMessage("Category deleted successfully");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateQr = async () => {
    try {
      setLoading(true);
      const response = await apiSend("/api/settings/regenerate-qr", "POST", {}, true);
      setSettings((prev) => ({ ...prev, publicSlug: response.publicSlug, publicUrl: response.publicUrl }));
      const stored = getStoredAuth();
      if (stored?.admin) {
        stored.admin = { ...stored.admin, publicSlug: response.publicSlug };
        setStoredAuth(stored);
      }
      onProfileUpdated?.((prev) => ({ ...prev, publicSlug: response.publicSlug }));
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("New password and confirm password must match");
      return;
    }

    try {
      setLoading(true);
      const response = await apiSend("/api/auth/change-password", "POST", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }, true);
      setPasswordForm(emptyPasswordState);
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyPublicUrl = async () => {
    if (!settings?.publicUrl) return;
    await navigator.clipboard.writeText(settings.publicUrl);
    setMessage("Public URL copied");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 w-full max-w-5xl overflow-y-auto bg-slate-50 shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-100 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-2xl font-black text-slate-900">Settings</p>
            <p className="text-sm text-slate-500">Properly connected hotel settings, category management, QR link, and security.</p>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-orange-100 p-2 text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!auth?.token ? (
          <div className="m-6 rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-slate-100 sm:m-8">
            <p className="text-2xl font-bold text-slate-900">Admin login required</p>
            <p className="mt-3 text-slate-600">This settings panel is connected to backend APIs and is available after admin login.</p>
          </div>
        ) : (
          <div className="grid gap-6 p-6 sm:grid-cols-[240px_1fr] sm:p-8">
            <aside className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                        activeTab === tab.id ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-orange-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
              {message ? <div className="mb-5 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">{message}</div> : null}
              {loading ? <div className="mb-5 text-sm font-semibold text-slate-500">Loading...</div> : null}

              {activeTab === "profile" && settings ? (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm font-semibold text-slate-700">
                      Hotel Name
                      <input value={settings.hotelName || ""} onChange={(event) => setSettings({ ...settings, hotelName: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-700">
                      Admin Name
                      <input value={settings.adminName || ""} onChange={(event) => setSettings({ ...settings, adminName: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-700">
                      Phone
                      <input value={settings.phone || ""} onChange={(event) => setSettings({ ...settings, phone: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-700">
                      Alt Phone
                      <input value={settings.altPhone || ""} onChange={(event) => setSettings({ ...settings, altPhone: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                      Contact Email
                      <input value={settings.contactEmail || ""} onChange={(event) => setSettings({ ...settings, contactEmail: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                      Address
                      <textarea value={settings.address || ""} onChange={(event) => setSettings({ ...settings, address: event.target.value })} rows={3} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                      About
                      <textarea value={settings.about || ""} onChange={(event) => setSettings({ ...settings, about: event.target.value })} rows={5} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                    </label>
                    <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                      Public Base URL
                      <input value={settings.publicBaseUrl || ""} onChange={(event) => setSettings({ ...settings, publicBaseUrl: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                    </label>
                  </div>
                  <button onClick={handleSaveSettings} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                    <Save className="h-4 w-4" />
                    Save changes
                  </button>
                </div>
              ) : null}

              {activeTab === "categories" ? (
                <div className="space-y-6">
                  <div className="rounded-[24px] bg-slate-50 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="space-y-2 text-sm font-semibold text-slate-700">
                        Category Name
                        <input value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                      </label>
                      <label className="space-y-2 text-sm font-semibold text-slate-700">
                        Sort Order
                        <input type="number" value={categoryForm.sortOrder} onChange={(event) => setCategoryForm({ ...categoryForm, sortOrder: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                      </label>
                      <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                        Description
                        <textarea value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} rows={3} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                      </label>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button onClick={handleCategorySubmit} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">{categoryForm.editId ? "Update category" : "Add category"}</button>
                      {categoryForm.editId ? <button onClick={() => setCategoryForm({ name: "", description: "", sortOrder: 0, editId: "" })} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Cancel edit</button> : null}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {categories.map((category) => (
                      <div key={category._id} className="rounded-[24px] border border-slate-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-lg font-bold text-slate-900">{category.name}</p>
                            <p className="mt-1 text-sm text-slate-500">Order: {category.sortOrder || 0}</p>
                            <p className="mt-2 text-sm text-slate-600">{category.description || "No description"}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setCategoryForm({ name: category.name, description: category.description || "", sortOrder: category.sortOrder || 0, editId: category._id })} className="rounded-full border border-orange-200 px-3 py-2 text-xs font-semibold text-orange-700">Edit</button>
                            <button onClick={() => handleDeleteCategory(category._id)} className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === "qr" && settings ? (
                <div className="space-y-5">
                  <div className="rounded-[24px] bg-slate-50 p-5">
                    <p className="text-lg font-bold text-slate-900">Public mobile link</p>
                    <p className="mt-2 text-sm text-slate-600">This link uses PUBLIC_BASE_URL from backend settings, not localhost.</p>
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 break-all">{settings.publicUrl || "No public link yet"}</div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button onClick={copyPublicUrl} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"><Copy className="h-4 w-4" /> Copy link</button>
                      <a href={settings.publicUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-700"><ExternalLink className="h-4 w-4" /> Open public page</a>
                      <button onClick={handleRegenerateQr} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"><QrCode className="h-4 w-4" /> Regenerate QR link</button>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "security" ? (
                <div className="grid gap-4 md:max-w-xl">
                  <label className="space-y-2 text-sm font-semibold text-slate-700">
                    Current Password
                    <input type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-700">
                    New Password
                    <input type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-700">
                    Confirm Password
                    <input type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                  </label>
                  <button onClick={handleChangePassword} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"><Shield className="h-4 w-4" /> Change password</button>
                </div>
              ) : null}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
