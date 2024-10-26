import './App.css'

import React, { useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import MenuSection from './components/MenuSection';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

const menuData = {
  appetizers: [
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
  ],
  mainCourses: [
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
  ],
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <MenuSection title="APPETIZERS" items={menuData.appetizers} />
        <MenuSection title="MAIN COURSES" items={menuData.mainCourses} />
      </main>

      <Footer />
    </div>
  );
};

export default App;