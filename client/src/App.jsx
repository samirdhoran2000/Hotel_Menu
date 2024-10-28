import "./App.css";

import { useEffect, useState } from "react";
import MenuSection from "./components/MenuSection";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import menuData from "./constant/data.js";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
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
      style={{
        backgroundColor: "hsl(196.8deg 33.78% 29.02%)",
      }}
    >
      <Header toggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-24 pb-12 flex justify-center items-center">
        <MenuSection items={menuData} />
      </main>

      <Footer />
    </div>
  );
};

export default App;
