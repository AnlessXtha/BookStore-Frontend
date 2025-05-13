import { ShoppingCart, User } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createApiClient } from "../lib/createApiClient";
import toast from "react-hot-toast";
import axios from "axios";

const API_BASE_URL = 'https://localhost:7086';

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    fetchActiveBanners();
  }, []);

  const fetchActiveBanners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Banner/all`);
      const activeBanners = response.data.filter(banner => {
        const now = new Date();
        const startDate = new Date(banner.startDate);
        const endDate = new Date(banner.endDate);
        return banner.isActive && now >= startDate && now <= endDate;
      });
      setBanners(activeBanners);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Banner Section */}
      {banners.length > 0 && (
        <div className="relative w-full h-[400px] overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.bannerId}
              className={`absolute w-full h-full transition-opacity duration-500 ${
                index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">{banner.title}</h2>
                <p className="text-lg">{banner.description}</p>
              </div>
            </div>
          ))}
          {/* Banner Navigation Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentBannerIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

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
            to="/catalog"
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
