const Footer = () => (
  <footer className="bg-gray-900 text-white py-16" id="footer">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Gourmet</h3>
          <p className="text-gray-400 mb-4">
            Crafting unforgettable dining experiences with the finest
            ingredients and exceptional service.
          </p>
        </div>
        <div>
          <h4 className="text-2xl font-bold mb-4">Quick Links</h4>
          <nav className="space-y-2">
            <a href="#menu" className="block text-gray-400 hover:text-white">
              Menu
            </a>
            <a href="#footer" className="block text-gray-400 hover:text-white">
              About Us
            </a>
            <a href="#footer" className="block text-gray-400 hover:text-white">
              Contact
            </a>
          </nav>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <address className="text-gray-400 not-italic">
            <p>123 Gourmet Street</p>
            <p>Pune City, MH 411057</p>
            <p className="mt-2">Phone: (+91) 90223 28048</p>
            <p>Email: contanct@techamica.com</p>
          </address>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
          <p className="text-gray-400 mb-4">
            Subscribe to our newsletter for updates and special offers.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-2 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
            <button className="px-4 py-2 bg-white text-gray-900 rounded-r-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>&copy; 2024 Gourmet. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
