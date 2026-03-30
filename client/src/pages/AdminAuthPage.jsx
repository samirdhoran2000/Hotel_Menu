import { ArrowLeft, LockKeyhole, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { apiSend } from "../utils/api";
import { setStoredAuth } from "../utils/config";

const AdminAuthPage = ({ mode = "login", onSuccess, onBack }) => {
  const isSignup = mode === "signup";
  const [form, setForm] = useState({
    hotelName: "",
    adminName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      const path = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const payload = isSignup
        ? form
        : {
            email: form.email,
            password: form.password,
          };

      const response = await apiSend(path, "POST", payload);
      setStoredAuth({ token: response.token, admin: response.admin });
      onSuccess?.(response.admin);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-[36px] bg-white p-6 shadow-xl ring-1 ring-orange-100 sm:p-10 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
        <div className="rounded-[30px] bg-slate-950 p-8 text-white">
          <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/90">
            <ArrowLeft className="h-4 w-4" />
            Back to public page
          </button>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-orange-300">Admin Area</p>
          <h1 className="mt-4 text-4xl font-black leading-tight">{isSignup ? "Create your hotel admin account" : "Sign in to manage menu and settings"}</h1>
          <p className="mt-5 text-sm leading-7 text-slate-300">
            This page is connected with real backend login and signup APIs. After login, you can manage hotel info, categories, menu items, public links, and password settings.
          </p>
        </div>

        <div className="mt-8 lg:mt-0">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
              {isSignup ? <UserCircle2 className="h-6 w-6" /> : <LockKeyhole className="h-6 w-6" />}
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{isSignup ? "New Admin" : "Admin Login"}</p>
              <p className="text-sm text-slate-500">Professional aligned form layout.</p>
            </div>
          </div>

          {message ? <div className="mb-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">{message}</div> : null}

          <form onSubmit={submit} className="grid gap-4">
            {isSignup ? (
              <>
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Hotel Name
                  <input value={form.hotelName} onChange={(event) => setForm({ ...form, hotelName: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Admin Name
                  <input value={form.adminName} onChange={(event) => setForm({ ...form, adminName: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
                </label>
              </>
            ) : null}
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              Email
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              Password
              <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400" />
            </label>
            <button disabled={loading} className="mt-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {loading ? "Please wait..." : isSignup ? "Create admin account" : "Login"}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-600">
            {isSignup ? (
              <button onClick={() => window.location.hash = "#/admin/login"} className="font-semibold text-orange-700">Already have an account? Login</button>
            ) : (
              <button onClick={() => window.location.hash = "#/admin/signup"} className="font-semibold text-orange-700">Need a new admin account? Create one</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;
