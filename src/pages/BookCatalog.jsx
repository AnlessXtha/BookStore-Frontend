import React from "react";
import intelligentInvestor from "../assets/intinvestor.png";
import wimpyKid from "../assets/wimpykid.png";
import predictiveAstrology from "../assets/PredictiveAstrology.png";
import becomingSupernatural from "../assets/becomingsupernatural.png";

const BookCatalog = () => {
  const books = [
    {
      id: 1,
      title: "The Intelligent Investor",
      author: "Benjamin Graham",
      price: "Rs. 550",
      image: intelligentInvestor
    },
    {
      id: 2,
      title: "Diary of a Wimpy Kid",
      author: "Jeff Kinney",
      price: "Rs. 550",
      image: wimpyKid
    },
    {
      id: 3,
      title: "Predictive Astrology",
      author: "Dinesh S Mathur",
      price: "Rs. 550",
      image: predictiveAstrology
    },
    {
      id: 4,
      title: "Becoming Supernatural",
      author: "Dr. Joe Dispenza",
      price: "Rs. 550",
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
              <div key={book.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                <div className="aspect-[3/4] w-full mb-4 overflow-hidden rounded">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                <p className="font-bold mb-3 text-blue-600">{book.price}</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  ADD TO CART
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
              <div key={book.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                <div className="aspect-[3/4] w-full mb-4 overflow-hidden rounded">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                <p className="font-bold mb-3 text-blue-600">{book.price}</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  ADD TO CART
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
              <div key={book.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                <div className="aspect-[3/4] w-full mb-4 overflow-hidden rounded">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                <p className="font-bold mb-3 text-blue-600">{book.price}</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  ADD TO CART
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
