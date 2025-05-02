import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">CoverToCover</h1>
          <nav className="flex items-center space-x-6">
  {/* Cart Icon with Badge */}
  <Link
    to="/cart"
    className="relative text-gray-500 hover:text-gray-700"
  >
    <ShoppingCart className="h-6 w-6" />
    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
      0
    </span>
  </Link>

  {/* Home Link */}
  <Link
    to="/"
    className="text-gray-600 hover:text-blue-600 active:text-blue-700"
  >
    Home
  </Link>

  {/* Catalogue Link */}
  <Link
    to="/catalogue"
    className="text-gray-600 hover:text-blue-600 active:text-blue-700"
  >
    Catalogue
  </Link>

  {/* About Link */}
  <Link
    to="/about"
    className="text-gray-600 hover:text-blue-600 active:text-blue-700"
  >
    About
  </Link>

  {/* Contact Link */}
  <Link
    to="/contact"
    className="text-gray-600 hover:text-blue-600 active:text-blue-700"
  >
    Contact
  </Link>
</nav>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold mb-6">Featured Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src={`https://via.placeholder.com/150?text=Book+${id}`}
                alt={`Book ${id}`}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold">Book Title {id}</h3>
              <p className="text-sm text-gray-600">by Author {id}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/catalogue"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            View Full Catalogue
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          © 2025 CoverToCover. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
