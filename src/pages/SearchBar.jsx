import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch, initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md mx-auto mb-8 group focus-within:ring-2 focus-within:ring-blue-400 rounded-md overflow-hidden shadow-sm"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books, or genres..."
        className="flex-grow px-4 py-2 border-y border-l border-gray-300 rounded-l-md focus:outline-none"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition-colors duration-200 flex items-center justify-center"
      >
        <Search size={18} className="mr-1" />
        <span>Search</span>
      </button>
    </form>
  );
};

export default SearchBar;
