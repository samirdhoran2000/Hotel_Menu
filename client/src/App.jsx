// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HotelDashboard from "./pages/HotelDashboard";
import HomePage from "./pages/HomePage";
import { DashboardHome, Analytics,Orders,Reports,Settings,Users } from "./components/DashboardComponents";


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotel/:id" element={<MenuPage />} />
          <Route path="/hotel/login" element={<LoginPage />} />
          <Route path="/hotel/registration" element={<RegisterPage />} />

          {/* Dashboard with nested routes */}
          <Route path="/hotel/dashboard/*" element={<HotelDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Add other routes here as needed */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
