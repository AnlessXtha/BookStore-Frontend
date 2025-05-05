import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HP from "../assets/hp.png";
import wimpyKid from "../assets/wimpykid.png";
import predictiveAstrology from "../assets/PredictiveAstrology.png";
import becomingSupernatural from "../assets/becomingsupernatural.png";
import { createApiClient } from "../lib/createApiClient";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { Search } from "lucide-react";

const BookCatalog = () => {
  const navigate = useNavigate();
  const booksStatic = [
    {
      id: 1,
      title: "Harry Potter",
      author: "JK",
      genre: "Magic",
      language: "English",
      publisher: "ram",
      format: "Hardcover",
      isbn: "978-0060555665",
      stockQuantity: 10,
      price: 550,
      isAvailable: true,
      discounts: null,
      image: HP,
    },
    {
      id: 2,
      title: "Diary of a Wimpy Kid",
      author: "Jeff Kinney",
      genre: "Children's Fiction",
      language: "English",
      publisher: "Amulet Books",
      format: "Paperback",
      isbn: "978-0810993136",
      stockQuantity: 15,
      price: 550,
      isAvailable: true,
      discounts: null,
      image: wimpyKid,
    },
    {
      id: 3,
      title: "Predictive Astrology",
      author: "Dinesh S Mathur",
      genre: "Astrology",
      language: "English",
      publisher: "Sagar Publications",
      format: "Paperback",
      isbn: "978-8170820660",
      stockQuantity: 8,
      price: 550,
      isAvailable: true,
      discounts: null,
      image: predictiveAstrology,
    },
    {
      id: 4,
      title: "Becoming Supernatural",
      author: "Dr. Joe Dispenza",
      genre: "Self-Help",
      language: "English",
      publisher: "Hay House",
      format: "Hardcover",
      isbn: "978-1401953113",
      stockQuantity: 12,
      price: 550,
      isAvailable: true,
      discounts: null,
      image: becomingSupernatural,
    },
  ];

  const { currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [books, setBooks] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]); // Assuming you have a cart state in your context or component

  const pageSize = 8;
  const apiClient = createApiClient("https://localhost:7086");

  const fetchBooks = async (query = "", page = 1, genre = "", sort = "") => {
    setIsLoading(true);
    try {
      const endpoint = `/api/Books/search?search=${encodeURIComponent(
        query
      )}&pageNumber=${page}&pageSize=${pageSize}&genre=${genre}&sort=${sort}`;

      const response = await apiClient.get(endpoint);
      setBooks(response.data?.items || []);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setBooks([]);
      setError(err.response?.data?.message || "Failed to fetch books.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(searchQuery, currentPage, genreFilter, sortBy);
  }, [searchQuery, currentPage, genreFilter, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks(searchQuery, 1, genreFilter, sortBy);
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
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Book Catalog</h1>

        <form
          onSubmit={handleSearch}
          className="flex justify-between items-center mb-8"
        >
          <div className="relative flex-1 max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to read?"
              className="w-full px-4 py-2 border rounded-md pr-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Search className="text-gray-500" />
            </button>
          </div>

          <div className="ml-4">
            <select
              value={sortBy}
              onChange={(e) => {
                const selectedSort = e.target.value;
                setSortBy(selectedSort);
                setCurrentPage(1);
                fetchBooks(searchQuery, 1, genreFilter, selectedSort);
              }}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">Sort By:</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="">Newest First</option>
            </select>
          </div>

          <div className="ml-4">
            <select
              value={genreFilter}
              onChange={(e) => {
                const selectedGenre = e.target.value;
                setGenreFilter(selectedGenre);
                setCurrentPage(1);
                fetchBooks(searchQuery, 1, selectedGenre, sortBy);
              }}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Genres</option>
              <option value="Magic">Magic</option>
              <option value="Children's Fiction">Children's Fiction</option>
              <option value="Astrology">Astrology</option>
              <option value="Self-Help">Self-Help</option>
            </select>
          </div>
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
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                  onClick={() => navigate(`/bookdetails/${book.bookId}`)}
                >
                  <div className="aspect-[3/4] w-full mb-4 overflow-hidden rounded">
                    <img
                      src={`https://localhost:7086${book.imagePath} `}
                      alt={book.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                  <p className="text-xs text-gray-500 mb-1">
                    Genre: {book.genre}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    Format: {book.format}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    ISBN: {book.isbn}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Stock: {book.stockQuantity}
                  </p>
                  <p className="font-bold mb-3 text-blue-600">
                    Rs. {book.price}
                  </p>
                  <div className="px-4 pb-4 flex justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!currentUser) {
                          toast.error("Please log in to add books to cart.");
                          navigate("/login");
                          return;
                        } else {
                          handleAddToCart(book);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!currentUser) {
                          toast.error(
                            "Please log in to add books to whitelist."
                          );
                          navigate("/login");
                          return;
                        } else {
                          handleAddToWhitelist(book);
                        }
                      }}
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
    </div>
  );
};

export default BookCatalog;
