import { Outlet } from "react-router-dom";
import Header from "../components/landingPageComponents/Header";
import Footer from "../components/landingPageComponents/Footer";

const HomePageLayout = () => {
  return (
    <>
      <Header />
      <Outlet/>
      <Footer />
    </>
  );
};

export default HomePageLayout;
