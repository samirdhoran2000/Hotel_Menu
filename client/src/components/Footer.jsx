import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="backdrop-blur-md shadow-md py-4" id="footer">
    <div className="container mx-auto px-4">
      <div className=" border-t border-gray-800 text-center text-gray-800">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <Link
            to={"/"}
            className="text-black hover:text-purple-800 transition-colors duration-300"
          >
            EasyMenu
          </Link>
          . All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
