import { useEffect, useState } from "react";
import Header from "../components/Header";
import MenuSection from "../components/MenuSection";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import SettingsPanel from "../components/SettingsPanel";
import { useDataManager } from "../utils/dataManager";

const PublicPage = ({ hotelProfile, onProfileUpdated, onOpenAdmin }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dataManager = useDataManager(hotelProfile);

  useEffect(() => {
    document.title = hotelProfile?.hotelName ? `${hotelProfile.hotelName} Menu` : "Digital Menu Card";
  }, [hotelProfile?.hotelName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white text-slate-900">
      <Header
        hotelName={hotelProfile?.hotelName}
        toggleSidebar={() => setIsSidebarOpen(true)}
        searchQuery={dataManager.searchQuery}
        setSearchQuery={dataManager.setSearchQuery}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdmin={onOpenAdmin}
        isAdminLoggedIn={Boolean(localStorage.getItem("digitalMenuAuth"))}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdmin={onOpenAdmin}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onProfileUpdated={onProfileUpdated}
      />

      <main className="pt-24 pb-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
          <section className="grid gap-6 rounded-[36px] bg-white/90 p-6 shadow-sm ring-1 ring-orange-100 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center gap-5">
              <p className="inline-flex w-fit rounded-full bg-orange-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-orange-700">Digital Menu Card</p>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl">Menu, About, Contact, and Setting connected in one clean hotel page.</h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Browse your menu, view hotel details, contact information, and open a fully connected settings panel. Popular and Trending tabs work together with normal categories.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#menu" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">View Menu</a>
                <a href="#about" className="rounded-full border border-orange-200 px-6 py-3 text-sm font-semibold text-orange-700">About Hotel</a>
              </div>
            </div>
            <div className="rounded-[30px] bg-gradient-to-br from-orange-100 via-amber-50 to-white p-6 ring-1 ring-orange-100">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Hotel Details</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-2xl font-black text-slate-900">{hotelProfile?.hotelName || "Your Hotel"}</p>
                  <p className="mt-2 text-sm text-slate-600">Managed by {hotelProfile?.adminName || "Admin"}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Phone</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{hotelProfile?.phone || "Not added yet"}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Contact Email</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900 break-all">{hotelProfile?.contactEmail || hotelProfile?.email || "Not added yet"}</p>
                  </div>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Address</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{hotelProfile?.address || "Add address from settings."}</p>
                </div>
              </div>
            </div>
          </section>

          <MenuSection dataManager={dataManager} />
        </div>
      </main>

      <Footer hotelProfile={hotelProfile} />
    </div>
  );
};

export default PublicPage;
