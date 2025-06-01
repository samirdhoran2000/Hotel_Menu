// import React from 'react'
// import Header from '../components/Header';
import { useEffect, useState } from "react";

import Header from '../components/Header';
import MenuSection from '../components/MenuSection';
import { useDataManager } from '../utils/dataManager';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';


const MenuPage = () => {
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
      className="min-h-screen bg-orange-100 relative"
      // style={{ backgroundColor: "hsl(196.8deg 33.78% 29.02%)" }}
    >
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-9w-96 bg-orange-500 rounded-full opacity-10 filter blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-800 rounded-full opacity-15 filter blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-orange-700 rounded-full opacity-15 filter blur-3xl" />
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
}

export default MenuPage