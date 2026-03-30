import { useEffect, useMemo, useState } from "react";
import PublicPage from "./pages/PublicPage";
import AdminAuthPage from "./pages/AdminAuthPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { apiGet } from "./utils/api";
import { getStoredAuth } from "./utils/config";

const buildDefaultProfile = () => {
  const auth = getStoredAuth();
  return auth?.admin
    ? { ...auth.admin, hotelId: auth.admin.hotelId || auth.admin._id }
    : {
        hotelName: "Gourmet",
        adminName: "Admin",
        phone: "",
        altPhone: "",
        address: "",
        about: "Fresh menu and hotel details will appear here.",
        contactEmail: "admin@example.com",
        publicSlug: "default",
      };
};

const routeFromHash = () => {
  const hash = window.location.hash || "#/";
  if (hash.startsWith("#/admin/login")) return "admin-login";
  if (hash.startsWith("#/admin/signup")) return "admin-signup";
  if (hash.startsWith("#/admin/dashboard")) return "admin-dashboard";
  return "public";
};

const App = () => {
  const [route, setRoute] = useState(routeFromHash());
  const [hotelProfile, setHotelProfile] = useState(buildDefaultProfile());
  const queryHotel = useMemo(() => new URLSearchParams(window.location.search).get("hotel"), [route]);

  useEffect(() => {
    const syncRoute = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    const loadPublicHotel = async () => {
      if (!queryHotel) return;
      try {
        const response = await apiGet(`/api/public/hotel/${queryHotel}`);
        setHotelProfile({ ...response.hotel, hotelId: response.hotel.hotelId });
      } catch {
        setHotelProfile(buildDefaultProfile());
      }
    };

    loadPublicHotel();
  }, [queryHotel]);

  const handleAuthSuccess = (admin) => {
    setHotelProfile({ ...admin, hotelId: admin.hotelId || admin._id });
    window.location.hash = "#/admin/dashboard";
  };

  const openAdmin = () => {
    const auth = getStoredAuth();
    window.location.hash = auth?.token ? "#/admin/dashboard" : "#/admin/login";
  };

  if (route === "admin-login") {
    return <AdminAuthPage mode="login" onSuccess={handleAuthSuccess} onBack={() => (window.location.hash = "#/")} />;
  }

  if (route === "admin-signup") {
    return <AdminAuthPage mode="signup" onSuccess={handleAuthSuccess} onBack={() => (window.location.hash = "#/")} />;
  }

  if (route === "admin-dashboard") {
    return <AdminDashboardPage onBack={() => (window.location.hash = "#/")} onProfileUpdated={setHotelProfile} />;
  }

  return <PublicPage hotelProfile={hotelProfile} onProfileUpdated={setHotelProfile} onOpenAdmin={openAdmin} />;
};

export default App;
