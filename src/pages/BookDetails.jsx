import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import HP from "../assets/hp.png";

import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { createApiClient } from "../lib/createApiClient";
import axios from "axios";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const apiClient = createApiClient("https://localhost:7086");

  const [bookData, setBookData] = useState(null);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await apiClient.get(`/api/Books/${id}`);
        setBookData(response.data);
      } catch (err) {
        setError("Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleAddToWhitelist = async () => {
    if (!currentUser) {
      toast.error("Please log in to add books to whitelist.");
      navigate("/login");
      return;
    } else {
      try {
        const endpoint = `api/Whitelist/add/${bookData.bookId}`;

        const response = await apiClient.post(endpoint, null, {
          headers: {
            Authorization: `Bearer ${token}`, // ensure token is valid
          },
        });

        // Optionally, you can update cart state here if needed
        toast.success("Added to Whitelist:", bookData.title);
      } catch (error) {
        console.error("Failed to add item to whitelist:", error);
      }
    }
    // setIsWhitelisted(!isWhitelisted);
    // toast.success("Book added to Whitelist");
  };

  const handleAddToCart = async () => {
    // setIsAddedToCart(true);
    if (!currentUser) {
      toast.error("Please log in to add books to cart.");
      navigate("/login");
      return;
    } else {
      try {
        const endpoint = `api/Cart/add?bookId=${bookData.bookId}&quantity=1`;

        const response = await apiClient.post(endpoint, null, {
          headers: {
            Authorization: `Bearer ${token}`, // ensure token is valid
          },
        });

        // Optionally, you can update cart state here if needed
        toast.success("Added to cart:", bookData.title);
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }
    }
    // toast.success("Book added to cart");
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921..." />
          </svg>
        ))}
        {hasHalfStar && (
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921..." />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921..." />
          </svg>
        ))}
      </div>
    );
  };

  const submitRating = async (bookId, stars, review) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post("/api/rate", {
        bookId,
        stars,
        review
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert(response.data.data); // "Rating submitted successfully!"
    } catch (err) {
      alert(err.response.data.message); // "You can only rate books you've purchased."
    }
  };


  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8 ">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img
              src={bookData.coverImage || "/fallback.jpg"}
              alt={`${bookData.title} book cover`}
              className="w-full shadow-lg"
            />
          </div>

          <div className="md:w-2/3 bg-white p-8 shadow">
            <h1 className="text-5xl font-bold mb-2">{bookData.title}</h1>
            <p className="text-2xl mb-4">by {bookData.author}</p>
            <p className="text-xl font-semibold mb-2">Rs. {bookData.price}</p>

            <div className="flex items-center mb-4">
              {renderStars(bookData.ratings?.average || 0)}
              <span className="ml-2 text-gray-600">
                {bookData.ratings?.average || 0}/5 (
                {bookData.ratings?.count || 0} ratings)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p>
                  <span className="font-semibold">Genre:</span> {bookData.genre}
                </p>
                <p>
                  <span className="font-semibold">Language:</span>{" "}
                  {bookData.language}
                </p>
                <p>
                  <span className="font-semibold">Publisher:</span>{" "}
                  {bookData.publisher}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Format:</span>{" "}
                  {bookData.format}
                </p>
                <p>
                  <span className="font-semibold">ISBN:</span> {bookData.isbn}
                </p>
                <p>
                  <span className="font-semibold">Stock:</span>{" "}
                  {bookData.stockQuantity}{" "}
                  {bookData.stockQuantity > 1 ? "copies" : "copy"} available
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-8">{bookData.description}</p>

            <p className="mb-2 text-sm text-gray-700">
              <span className="font-semibold">Available Stock:</span>{" "}
              {bookData.stockQuantity}{" "}
              {bookData.stockQuantity > 1 ? "copies" : "copy"}
            </p>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToWhitelist}
                className={`px-6 py-2 border-2 border-black font-medium ${isWhitelisted ? "bg-gray-200" : "bg-white"
                  }`}
                disabled={!bookData.isAvailable}
              >
                {isWhitelisted ? "Added to Whitelist" : "Add to Whitelist"}
              </button>
              <button
                onClick={handleAddToCart}
                className={`px-6 py-2 bg-black text-white font-medium ${isAddedToCart || !bookData.isAvailable ? "opacity-75" : ""
                  }`}
                disabled={!bookData.isAvailable || isAddedToCart}
              >
                {!bookData.isAvailable
                  ? "Out of Stock"
                  : isAddedToCart
                    ? "Added to Cart"
                    : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          © 2025 CoverToCover. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default BookDetails;