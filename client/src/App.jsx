// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import HotelLoginPage from "./pages/HotelLoginPage";
import UserLoginPage from "./pages/UserLoginPage";
import RegisterPage from "./pages/RegisterPage";
import HotelDashboard from "./pages/HotelDashboard";
import HomePage from "./pages/HomePage";
import { DashboardHome, Analytics, Orders, Reports, Settings } from "./components/DashboardComponents";
import Users from "./components/dashboard/Users"; // Assuming you have a Users component
import MenuItemForm from "./components/dashboard/MenuItem";
import MenuManager from "./components/dashboard/MenuManager";
import ComingSoon from "./pages/ComingSoon";
// import MenuManager from "/MenuManager";


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotel/:id" element={<MenuPage />} />
          <Route path="/hotel/login" element={<HotelLoginPage />} />
          <Route path="/user/login" element={<UserLoginPage />} />
          <Route path="/hotel/registration" element={<RegisterPage />} />
          <Route path="/coming" element={<ComingSoon />} />

          {/* Dashboard with nested routes */}
          <Route path="/hotel/dashboard/*" element={<HotelDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="analytics" element={<Analytics />} />
            {/* <Route path="users" element={<Users />} /> */}
            <Route path="orders" element={<Orders />} />
            {/* <Route path="menu" element={<MenuItemForm />} /> */}
            <Route path="menu" element={<MenuManager />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Add other routes here as needed */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
