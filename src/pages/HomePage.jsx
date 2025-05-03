import { ShoppingCart, User } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createApiClient } from "../lib/createApiClient";

const HomePage = () => {
  const { currentUser } = useContext(AuthContext);

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageSize = 10;
  const apiClient = createApiClient("https://localhost:7086");

  const fetchBooks = async (query = "", page = 1) => {
    setIsLoading(true);
    try {
      const endpoint = query
        ? `/api/Books/search?search=${encodeURIComponent(
            query
          )}&pageNumber=${page}&pageSize=${pageSize}`
        : `/api/Books?pageNumber=${page}&pageSize=${pageSize}`;

      const response = await apiClient.get(endpoint);
      setBooks(response.data.items || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch books.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks(searchQuery, 1);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => Math.max(1, prev + direction));
  };
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

            {currentUser ? (
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 active:text-blue-700 flex items-center gap-2"
              >
                <User className="h-6 w-6" />
                {currentUser?.firstName} {currentUser?.lastName}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 active:text-blue-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="text-gray-600 hover:text-blue-600 active:text-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Book List</h1>

        <form onSubmit={handleSearch} className="flex justify-center mb-6">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search for a book..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-l px-4 py-2 w-64"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading books...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div
                  key={book.bookId}
                  className="bg-white shadow-md rounded-lg overflow-hidden"
                >
                  <img
                    src="https://via.placeholder.com/300x180.png?text=Book+Image"
                    alt="Book"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{book.title}</h2>
                    <p className="text-sm text-gray-600 mb-1">
                      Author: {book.author}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Genre: {book.genre}
                    </p>
                    <p className="text-sm font-semibold text-blue-600">
                      Rs. {book.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => handlePageChange(-1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-lg font-medium">Page {currentPage}</span>
              <button
                onClick={() => handlePageChange(1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
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
