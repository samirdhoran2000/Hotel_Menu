// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import HotelLoginPage from "./pages/HotelLoginPage";
import RegisterPage from "./pages/HotelRegisterPage";
import HotelDashboard from "./pages/HotelDashboard";
import HomePage from "./pages/HomePage";
import {
  DashboardHome,
  Analytics,
  Orders,
  Reports,
  Settings,
} from "./components/DashboardComponents";
import MenuManager from "./components/dashboard/MenuManager";
import ComingSoon from "./pages/ComingSoon";
import HotelDashboard2 from "./components/dashboard/temp/Overview";
import QRCodeManagement from "./components/dashboard/temp/QRCodeManagement";
import HotelierMenuManager from "./components/dashboard/temp/HotelierMenuManager";
import Temp4 from "./components/dashboard/temp/Temp4";
import Temp5 from "./components/dashboard/temp/Temp5";
import HomePageLayout from "./pages/HomePageLayout";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <>
      <Router>
        <ScrollToTop />

        <Routes>
          <Route path="/hotel/:id" element={<MenuPage />} />
          <Route path="/" element={<HomePageLayout />}>
            <Route path="/" index element={<HomePage />} />
            <Route path="/hotel/login" element={<HotelLoginPage />} />
            <Route path="/hotel/registration" element={<RegisterPage />} />
            <Route path="/coming" element={<ComingSoon />} />
          </Route>

          {/* Dashboard with nested routes */}
          <Route path="/hotel/dashboard/*" element={<HotelDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="analytics" element={<Analytics />} />
            {/* <Route path="users" element={<Users />} /> */}
            <Route path="orders" element={<Orders />} />
            {/* <Route path="menu" element={<MenuItemForm />} /> */}
            <Route path="menu" element={<MenuManager />} />
            <Route path="settings" element={<Settings />} />
            <Route path="temp1" element={<HotelDashboard2 />} />
            <Route path="temp2" element={<QRCodeManagement />} />
            <Route path="temp3" element={<HotelierMenuManager />} />
            <Route path="temp4" element={<Temp4 />} />
            <Route path="temp5" element={<Temp5 />} />
            <Route path="qrcodes" element={<Settings />} />
          </Route>

          {/* Add other routes here as needed */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
