// import React from 'react'

// import { Link } from 'react-router-dom'

// const HomePage = () => {
//   return (
//     <>
//       <div className='flex justify-evenly items-center h-screen bg-gray-100'>

//       <Link to="/hotel/login" className="btn btn-primary">
//       Login
//       </Link>

//       <Link to="/hotel/registration" className="btn btn-primary">
//       Register
//       </Link>
//       </div>

//     </>
//   )
// }

// export default HomePage

import Hero from "../components/landingPageComponents/Hero";
import WhyWeExist from "../components/landingPageComponents/WhyWeExist";
import Footer from "../components/landingPageComponents/Footer";
import CTA from "../components/landingPageComponents/CTA";
import Contact from "../components/landingPageComponents/Contact";
import WhyItsFree from "../components/landingPageComponents/WhyItsFree";
import CoreValues from "../components/landingPageComponents/CoreValues";
import Team from "../components/landingPageComponents/Team";
import Testimonials from "../components/landingPageComponents/Testimonials";
import FAQ from "../components/landingPageComponents/FAQ";
import Milestones from "../components/landingPageComponents/Milestones";
import CaseStudies from "../components/landingPageComponents/CaseStudies";
import Header from "../components/landingPageComponents/Header";
import Blogs from "../components/landingPageComponents/Blogs";

const MenuCardAbout = () => {
  return (
    <div className="min-h-screen bg-orange-50 font-sans">
      {/* Header */}
      {/* <Header /> */}

      {/* Hero Section */}
      <Hero />

      {/* Why We Exist */}
      <WhyWeExist />

      {/* Core Values */}
      <CoreValues />

      {/* Team */}
      {/* <Team /> */}

      {/* Testimonials */}
      <Testimonials />

      {/* Case Studies */}
      <CaseStudies />

      {/* Milestones */}
      <Milestones />

      {/* Why It's Free */}
      <WhyItsFree />

      {/* Blogs */}
      <Blogs />

      {/* FAQ */}
      <FAQ />

      {/* Contact */}
      <Contact />

      {/* CTA */}
      <CTA />

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default MenuCardAbout;
