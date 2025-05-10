import React from 'react';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book, onAddToCart, onAddToWishlist, onViewDetails }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg">
            <div className="relative overflow-hidden">
                <img
                    src={book.imagePath || ""}
                    alt={book.title}
                    className="w-full h-44 object-cover transition-transform duration-500 hover:scale-105"
                />
            </div>
            <div className="p-4 flex-grow">
                <h2 className="text-lg font-semibold line-clamp-1">{book.title}</h2>
                <p className="text-sm text-gray-600 mb-1">Author: {book.author}</p>
                <p className="text-sm text-gray-600 mb-1">Genre: {book.genre}</p>
                <p className="text-sm font-semibold text-blue-600">Rs. {book.price}</p>
            </div>
            <div className="px-4 pb-4 flex justify-between gap-2">
                <button
                    onClick={() => onAddToCart(book)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded flex items-center gap-1 transition-colors"
                >
                    <ShoppingCart size={14} />
                    <span className="hidden sm:inline">Add</span>
                </button>
                <button
                    onClick={() => navigate(`/bookdetails/${book.bookId}`)}
                    className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded flex items-center gap-1 transition-colors"
                >
                    <Eye size={14} />
                    <span className="hidden sm:inline">View</span>
                </button>
                <button
                    onClick={() => onAddToWishlist(book)}
                    className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded flex items-center gap-1 transition-colors"
                >
                    <Heart size={14} />
                    <span className="hidden sm:inline">Save</span>
                </button>
            </div>
        </div>

    );
};

export default BookCard;