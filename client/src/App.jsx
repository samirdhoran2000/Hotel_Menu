import './App.css'

import React, { useEffect, useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import MenuSection from './components/MenuSection';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

const menuData = [
  {
    id: 1,
    name: "MAHN COLL OVEN",
    price: 550,
    originalPrice: 1200,
    sgm: "SGM 200",
    images: ["./dish_A.jpeg", "./dish_B.jpeg"],
    description:
      "Doublesworn Grethellow Heo Eenex Deotent, Deotent fexis oeotre setuza ot dein ottent exues hoxtelt jhok emkoer.",
  },
  {
    id: 2,
    name: "MOOUR THIENIS",
    price: 9330,
    originalPrice: 1200,
    sgm: "SGI 200",
    images: ["./dish_A.jpeg", "./dish_B.jpeg"],
    description:
      "Deotly seoty Satethellow Htew Eenoos, Deotent, Deotent fexis ototu ot deken ot seia ottent avouls hoxtelt.",
  },
  {
    id: 3,
    name: "MAIN COUTCEOS",
    price: 450,
    originalPrice: 1200,
    sgm: "SGM 200",
    images: ["./dish_A.jpeg", "./dish_B.jpeg"],
    description:
      "Doublesworn Satethellow Hteo Eenex Deotent, Deotent fexis ototu ot deken ot seia ottent avouls hoxtelt.",
  },
  {
    id: 4,
    name: "PECCMN CHER CHIDRER",
    price: 700,
    originalPrice: 1200,
    sgm: "CGM 200",
    images: ["./dish_A.jpeg", "./dish_B.jpeg"],
    description:
      "Deotly seoty Satethellow Htew Eenoos Deotent, Deotent fexis ototu ot deken ot seia ottent avouls hoxtelt.",
  },
  {
    id: 5,
    name: "REMTANIGE OUI DUIEVER",
    price: 450,
    originalPrice: 1200,
    sgm: "SSM 200",
    images: ["./dish_A.jpeg", "./dish_B.jpeg"],
    description:
      "Doublesworn Satethellow Htew Eenoos Deotent, deotent fexis ototu ot deken ot seia ottent avouls hoxtelt.",
  },
  {
    id: 6,
    name: "MECRENCINITS CANCTIDUN",
    price: 280,
    originalPrice: 1200,
    sgm: "SGM 200",
    images: ["./dish_A.jpeg", "./dish_B.jpeg"],
    description:
      "Doublesworn Satethellow Hteo Eenex Deotent, Deotent fexis ototu ot deken ot seia ottent avouls hoxtelt.",
  },
];


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
      className="min-h-screen bg-gray-50"
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