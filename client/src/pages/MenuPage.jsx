import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import MenuSection from "../components/MenuSection";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useDataManager } from "../utils/dataManager";

const MenuPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const params = useParams();
  const dataManager = useDataManager({ id: params?.id });

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Fixed full‑screen background */}

      <div className="fixed inset-0 bg-gradient-to-br from-orange-100 via-white to-yellow-100" />

      {/* Your normal page flow */}
      <Header
        toggleSidebar={() => setIsSidebarOpen(true)}
        searchQuery={dataManager.searchQuery}
        setSearchQuery={dataManager.setSearchQuery}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 pt-24 pb-12 flex justify-center items-start overflow-auto">
        <MenuSection dataManager={dataManager} />
      </main>

      <Footer />
    </div>
  );
};

export default MenuPage;
