import React from "react";
import { useNavigate } from "react-router-dom";
import HP from "../assets/hp.png";
import wimpyKid from "../assets/wimpykid.png";
import predictiveAstrology from "../assets/PredictiveAstrology.png";
import becomingSupernatural from "../assets/becomingsupernatural.png";

const BookCatalog = () => {
  const navigate = useNavigate();
  const books = [
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
      image: HP
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
      image: wimpyKid
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
      image: predictiveAstrology
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
      image: becomingSupernatural
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Book Catalog */}
        <h1 className="text-4xl font-bold text-center mb-8">Book Catalog</h1>

        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative flex-1 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="What do you want to read?"
              className="w-full px-4 py-2 border rounded-md pr-10"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
          <div className="ml-4">
            <select className="px-4 py-2 border rounded-md">
              <option>Sort By:</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>

        {/* Best Sellers Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Best Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <div 
                key={book.id} 
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => navigate('/bookdetails')}
                >
                  <div className="aspect-[3/4] w-full mb-4 overflow-hidden rounded">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                  <p className="text-xs text-gray-500 mb-1">Genre: {book.genre}</p>
                  <p className="text-xs text-gray-500 mb-1">Format: {book.format}</p>
                  <p className="text-xs text-gray-500 mb-1">ISBN: {book.isbn}</p>
                  <p className="text-xs text-gray-500 mb-2">Stock: {book.stockQuantity}</p>
                  <p className="font-bold mb-3 text-blue-600">Rs. {book.price}</p>
                </div>
                <button 
                  className={`w-full py-2 rounded transition ${
                    book.isAvailable 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                  disabled={!book.isAvailable}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to cart logic will go here
                  }}
                >
                  {book.isAvailable ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <div 
                key={book.id} 
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => navigate('/bookdetails')}
                >
                  <div className="aspect-[3/4] w-full mb-4 overflow-hidden rounded">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                  <p className="text-xs text-gray-500 mb-1">Genre: {book.genre}</p>
                  <p className="text-xs text-gray-500 mb-1">Format: {book.format}</p>
                  <p className="text-xs text-gray-500 mb-1">ISBN: {book.isbn}</p>
                  <p className="text-xs text-gray-500 mb-2">Stock: {book.stockQuantity}</p>
                  <p className="font-bold mb-3 text-blue-600">Rs. {book.price}</p>
                </div>
                <button 
                  className={`w-full py-2 rounded transition ${
                    book.isAvailable 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                  disabled={!book.isAvailable}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to cart logic will go here
                  }}
                >
                  {book.isAvailable ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Bestselling Authors Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Bestselling Authors</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <div 
                key={book.id} 
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => navigate('/bookdetails')}
                >
                  <div className="aspect-[3/4] w-full mb-4 overflow-hidden rounded">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                  <p className="text-xs text-gray-500 mb-1">Genre: {book.genre}</p>
                  <p className="text-xs text-gray-500 mb-1">Format: {book.format}</p>
                  <p className="text-xs text-gray-500 mb-1">ISBN: {book.isbn}</p>
                  <p className="text-xs text-gray-500 mb-2">Stock: {book.stockQuantity}</p>
                  <p className="font-bold mb-3 text-blue-600">Rs. {book.price}</p>
                </div>
                <button 
                  className={`w-full py-2 rounded transition ${
                    book.isAvailable 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                  disabled={!book.isAvailable}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to cart logic will go here
                  }}
                >
                  {book.isAvailable ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookCatalog;
