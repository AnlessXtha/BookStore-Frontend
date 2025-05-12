import React from "react";
import BookCard from "./BookCard";

const BookGrid = ({
  books,
  isLoading,
  error,
  onAddToCart,
  onAddToWishlist,
  onViewDetails,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg my-4 text-center">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">
          No books found. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.bookId}
          book={book}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default BookGrid;
