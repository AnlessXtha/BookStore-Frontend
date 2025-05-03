import { ShoppingCart, User } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createApiClient } from "../lib/createApiClient";
import toast from "react-hot-toast";

const HomePage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
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
