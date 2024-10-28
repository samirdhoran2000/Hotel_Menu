// src/App.js

import { useDataManager } from "./utils/dataManager";
import Header from "./components/Header";
import MenuSection from "./components/MenuSection";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dataManager = useDataManager();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-orange-500"
      style={{ backgroundColor: "hsl(196.8deg 33.78% 29.02%)" }}
    >
      <Header
        toggleSidebar={() => setIsSidebarOpen(true)}
        searchQuery={dataManager.searchQuery}
        setSearchQuery={dataManager.setSearchQuery}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-24 pb-12 flex justify-center items-center">
        <MenuSection dataManager={dataManager} />
      </main>

      <Footer />
    </div>
  );
};

export default App;
