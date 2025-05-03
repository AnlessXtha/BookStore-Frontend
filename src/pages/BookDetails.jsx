import React, { useState } from "react";
import { Link } from "react-router-dom";

const BookDetails = () => {
    // Static book data from backend (for now)
    const bookData = {
        bookId: 2,
        title: "Hari Potter",
        author: "JK",
        genre: "magic",
        language: "eng",
        publisher: "ram",
        format: "khai",
        isbn: "1234323",
        stockQuantity: 5,
        price: 800,
        isAvailable: true,
        discounts: null,
        // Added image placeholder
        coverImage: "src/assets/hp.png",
        // Added some additional details for UI display
        ratings: {
            average: 4.2,
            count: 322
        },
        description: "A magical journey of a young wizard discovering his powers and fighting against dark forces. This book follows Hari Potter as he navigates through the world of wizardry, making friends and encountering enemies along the way. Perfect for readers of all ages who enjoy fantasy literature with elements of adventure, friendship, and courage."
    };

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAddedToCart, setIsAddedToCart] = useState(false);

    const handleAddToWishlist = () => {
        setIsWishlisted(!isWishlisted);
    };

    const handleAddToCart = () => {
        setIsAddedToCart(true);
    };

    // Function to render star ratings
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex">
                {[...Array(fullStars)].map((_, index) => (
                    <svg key={`full-${index}`} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                {hasHalfStar && (
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                )}
                {[...Array(emptyStars)].map((_, index) => (
                    <svg key={`empty-${index}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 text-gray-800 min-h-screen">
            {/* Navbar */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center">
                        <img
                            src="/logo.png"
                            alt="Cover2Cover Logo"
                            className="h-8 w-auto mr-2"
                        />
                        <span className="text-2xl font-bold">cover2cover</span>
                    </Link>
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-blue-600">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </Link>
                        <Link to="/catalogue" className="text-gray-600 hover:text-blue-600">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                        </Link>
                        <Link to="/bookmarks" className="text-gray-600 hover:text-blue-600">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                        </Link>
                        <Link to="/cart" className="text-gray-600 hover:text-blue-600">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                        </Link>
                        <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Book Cover Image */}
                    <div className="md:w-1/3">
                        <img
                            src={bookData.coverImage}
                            alt={`${bookData.title} book cover`}
                            className="w-full shadow-lg"
                        />
                    </div>

                    {/* Book Details */}
                    <div className="md:w-2/3 bg-white p-8 shadow">
                        <h1 className="text-5xl font-bold mb-2">{bookData.title}</h1>
                        <p className="text-2xl mb-4">by {bookData.author}</p>
                        <p className="text-xl font-semibold mb-2">Rs. {bookData.price}</p>

                        <div className="flex items-center mb-4">
                            {renderStars(bookData.ratings.average)}
                            <span className="ml-2 text-gray-600">
                                {bookData.ratings.average}/5 ({bookData.ratings.count} ratings)
                            </span>
                        </div>

                        {/* Additional book details */}
                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div>
                                <p><span className="font-semibold">Genre:</span> {bookData.genre}</p>
                                <p><span className="font-semibold">Language:</span> {bookData.language}</p>
                                <p><span className="font-semibold">Publisher:</span> {bookData.publisher}</p>
                            </div>
                            <div>
                                <p><span className="font-semibold">Format:</span> {bookData.format}</p>
                                <p><span className="font-semibold">ISBN:</span> {bookData.isbn}</p>
                                <p><span className="font-semibold">Stock:</span> {bookData.stockQuantity} {bookData.stockQuantity > 1 ? 'copies' : 'copy'} available</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="text-gray-700 mb-4">
                                {bookData.description}
                            </p>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddToWishlist}
                                className={`px-6 py-2 border-2 border-black font-medium ${
                                    isWishlisted ? "bg-gray-200" : "bg-white"
                                }`}
                                disabled={!bookData.isAvailable}
                            >
                                {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
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

export default BookDetails;