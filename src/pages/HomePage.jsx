import { Eye, ShoppingCart, User } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createApiClient } from "../lib/createApiClient";
import toast from "react-hot-toast";

const HomePage = () => {
  const { currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]); // Assuming you have a cart state in your context or component

  const pageSize = 8;
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

  const handleAddToCart = async (book) => {
    try {
      const endpoint = `api/Cart/add?bookId=${book.bookId}&quantity=1`;

      const response = await apiClient.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`, // ensure token is valid
        },
      });

      // Optionally, you can update cart state here if needed
      toast.success("Added to cart:", book.title);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };


  const handleAddToWhitelist = async (book) => {

    try {
      const endpoint = `api/Whitelist/add/${book.bookId}`;

      const response = await apiClient.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`, // ensure token is valid
        },
      });

      // Optionally, you can update cart state here if needed
      toast.success("Added to Whitelist:", book.title);
    } catch (error) {
      console.error("Failed to add item to whitelist:", error);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800">
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
                  className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
                >
                  <img
                    src="https://via.placeholder.com/300x180.png?text=Book+Image"
                    alt="Book"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4 flex-grow">
                    <h2 className="text-lg font-semibold">{book.title}</h2>
                    <p className="text-sm text-gray-600 mb-1">Author: {book.author}</p>
                    <p className="text-sm text-gray-600 mb-1">Genre: {book.genre}</p>
                    <p className="text-sm font-semibold text-blue-600">Rs. {book.price}</p>
                  </div>
                  <div className="px-4 pb-4 flex justify-between gap-2">
                    <button
                      onClick={() => handleAddToCart(book)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                    >
                      Add to Cart
                    </button>
                    <Link

                      to={`/bookdetails/${book.bookId}`}
                      className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
                    >
                      <Eye />
                      </Link>

                    <button
                      onClick={() => handleAddToWhitelist(book)}
                      className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
                    >
                      Whitelist
                    </button>
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
