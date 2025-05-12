import React, { useState, useEffect, useContext } from 'react';
import { Bell } from 'lucide-react';
import BookGrid from './BookGrid';
import Pagination from './Pagination';
import { createApiClient } from '../lib/createApiClient';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import OrderNotifications from './OrderNotifications';
// import mockBooks from './data/mockBooks';

const HomePage = () => {

  const { currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  // State management
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cart and wishlist state
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Recent purchase for notification bar
  const recentPurchase = {
    customerName: 'Subodh Lc',
    bookTitle: 'Becoming Supernatural'
  };
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

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);

    if (!query.trim()) {
      setFilteredBooks(books);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const results = books.filter(
      book =>
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery) ||
        book.genre.toLowerCase().includes(lowercaseQuery)
    );

    setFilteredBooks(results);
  };

  // Handle pagination
  const handlePageChange = (direction) => {
    setCurrentPage((prev) => Math.max(1, prev + direction));
  };

  // Cart and wishlist handlers
  const handleAddToCart = async (book) => {
    try {
      const endpoint = `api/Cart/add?bookId=${book.bookId}&quantity=1`;

      const response = await apiClient.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`, // ensure token is valid
        },
      });
      console.log(book.title)
      toast.success(`Added to cart: ${book.title}`);
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
      toast.success("Added to Whitelist: " + book.title);
    } catch (error) {
      console.error("Failed to add item to whitelist:", error);
    }
  };

  const handleViewDetails = (bookId) => {
    alert(`Viewing details for book ID: ${bookId}`);
  };

  return (
    <div className="font-system bg-gray-50 text-gray-800 min-h-screen">
      {/* Notification Bar */}
      < OrderNotifications />

      {/* Hero Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Find your next read at <span className="font-extrabold">cover2cover</span>
            </h1>
            <p className="text-xl text-gray-600">Thousands of books at your fingertips!</p>
            <Link to='/catalog'>
              <button className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors">
                Browse Catalog
              </button>
            </Link>
          </div>

          {/* Book covers */}
          <div className="relative h-[300px] md:h-[400px] flex justify-center">
            <div className="absolute transform rotate-[-8deg] left-0 top-1/2 -translate-y-1/2 w-[140px] md:w-[180px] transition-all hover:z-10 hover:scale-105">
              <img
                src="https://images.pexels.com/photos/2846814/pexels-photo-2846814.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="When Women Ruled the World"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="absolute z-[1] top-1/2 -translate-y-1/2 w-[140px] md:w-[180px] transition-all hover:z-10 hover:scale-105">
              <img
                src="https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Twice the Speed of Dark"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="absolute transform rotate-[8deg] right-0 top-1/2 -translate-y-1/2 w-[140px] md:w-[180px] transition-all hover:z-10 hover:scale-105">
              <img
                src="https://images.pexels.com/photos/4170629/pexels-photo-4170629.jpeg"
                alt="1984"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Our Book Collection</h1>

        {/* Search */}
        <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />

        {/* Book Grid with Loading, Error states */}
        <BookGrid
          books={books}
          isLoading={isLoading}
          error={error}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWhitelist}
          onViewDetails={handleViewDetails}
        />

        {/* Pagination */}
        {!isLoading && !error && books.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Featured Books Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8">Featured Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {books.slice(0, 3).map(book => (
              <div
                key={book.bookId}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-4">by {book.author}</p>
                  <button
                    onClick={() => handleAddToCart(book)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart - Rs. {book.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Cover2Cover</h3>
              <p className="text-gray-400">Your premier destination for books of all genres. Find your next favorite read with us.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Catalog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-400 mb-2">Email:  bookstore1043@gmail.com</p>
              <p className="text-gray-400 mb-2">Phone: +977 1234567</p>
              <p className="text-gray-400">Address: Sanchal Sanepa, Lalipur</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-500">
            <p>© 2025 Cover2Cover. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;