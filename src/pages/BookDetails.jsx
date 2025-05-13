import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import HP from "../assets/hp.png";

// import HP from "../assets/hp.png";

import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { createApiClient } from "../lib/createApiClient";

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

  // New state for reviews
  const [reviews, setReviews] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await apiClient.get(`/api/Books/${id}`);
        setBookData(response.data.data);
        fetchReviews();
        if (currentUser) {
          checkPurchaseStatus();
        }
      } catch (err) {
        setError("Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, currentUser]);

  const checkPurchaseStatus = async () => {
    try {
      const response = await apiClient.get(`/api/Review/has-purchased/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHasPurchased(response.data.success);
    } catch (error) {
      setHasPurchased(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await apiClient.get(`/api/Review/Get-Book/${id}`);
      console.log("Full Review Response:", response); // Debug full response
      console.log("Review Data:", response.data); // Debug data specifically
      if (response.data.success) {
        const reviewsData = response.data.data || [];
        console.log("Reviews Array:", reviewsData); // Debug reviews array
        setReviews(reviewsData);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please log in to submit a review.");
      navigate("/login");
      return;
    }

    if (!hasPurchased) {
      toast.error("You must purchase this book to leave a review.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const reviewData = {
        ...reviewForm,
        bookId: parseInt(id),
        date: new Date().toISOString(),
      };

      console.log("Submitting review data:", reviewData); // Debug review submission

      const response = await apiClient.post("/api/Review/add", reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Review submission response:", response); // Debug submission response

      toast.success("Review submitted successfully!");
      setReviewForm({ rating: 5, comment: "" });
      fetchReviews();
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8 ">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img
              src={`https://localhost:7086${bookData.imagePath} `}
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
                {/* <p>
                  <span className="font-semibold">Stock:</span>{" "}
                  {bookData.stockQuantity}{" "}
                  {bookData.stockQuantity > 1 ? "copies" : "copy"} available
                </p> */}
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
                className={`px-6 py-2 border-2 border-black font-medium ${
                  isWhitelisted ? "bg-gray-200" : "bg-white"
                }`}
                disabled={!bookData.isAvailable}
              >
                {isWhitelisted ? "Added to Whitelist" : "Add to Whitelist"}
              </button>
              <button
                onClick={handleAddToCart}
                className={`px-6 py-2 bg-black text-white font-medium ${
                  isAddedToCart || !bookData.isAvailable ? "opacity-75" : ""
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

        {/* Reviews Section */}
        <div className="mt-12 bg-white p-8 shadow rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>

          {/* Review Form */}
          {currentUser && hasPurchased && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-8 p-6 bg-gray-50 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm((prev) => ({ ...prev, rating: star }))
                      }
                      className={`text-2xl ${
                        star <= reviewForm.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => {
                console.log("Individual Review:", review); // Debug individual review
                return (
                  <div key={review.reviewId} className="border-b pb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < review.rating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      By {currentUser?.userName || "Anonymous"}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">
                No reviews yet. Be the first to review!
              </p>
            )}
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
