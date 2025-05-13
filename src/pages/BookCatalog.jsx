import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApiClient } from "../lib/createApiClient";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { Search } from "lucide-react";
import {
  availabilityOptions,
  formatOptions,
  genreOptions,
  languageOptions,
} from "../constants/genreOptions";

const BookCatalog = () => {
  const navigate = useNavigate();

  const { currentUser, addToCart } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [books, setBooks] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [mainFilter, setMainFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [formatFilter, setFormatFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const [sortBy, setSortBy] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]); // Assuming you have a cart state in your context or component

  const pageSize = 8;
  const apiClient = createApiClient("https://localhost:7086");

  const fetchBooks = async (
    query = "",
    page = 1,
    genre = "",
    sort = "",
    author = "",
    availability = "",
    language = "",
    format = "",
    priceRange = { min: "", max: "" },
    filter = ""
  ) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        search: query,
        pageNumber: page.toString(),
        pageSize: pageSize.toString(),
        genre,
        sort,
        author,
        availability,
        language,
        format,
        minPrice: priceRange.min.toString(),
        maxPrice: priceRange.max.toString(),
        filter,
      });

      if (priceRange.min !== "" && !isNaN(Number(priceRange.min))) {
        params.set("minPrice", priceRange.min.toString());
      }
      if (priceRange.max !== "" && !isNaN(Number(priceRange.max))) {
        params.set("maxPrice", priceRange.max.toString());
      }

      for (const [key, value] of params.entries()) {
        if (value === "") {
          params.delete(key);
        }
      }

      const endpoint = `/api/Books/search?${params.toString()}`;
      const response = await apiClient.get(endpoint);

      setBooks(response?.data?.data?.items || []);
      setTotalPages(response?.data?.data?.totalPages);
    } catch (err) {
      setBooks([]);
      setError(err.response?.data?.data?.message || "Failed to fetch books.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(
      searchQuery,
      currentPage,
      genreFilter,
      sortBy,
      authorFilter,
      availabilityFilter,
      languageFilter,
      formatFilter,
      priceRange,
      mainFilter
    );
  }, [
    searchQuery,
    currentPage,
    genreFilter,
    sortBy,
    authorFilter,
    availabilityFilter,
    languageFilter,
    formatFilter,
    priceRange,
    mainFilter,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks(
      searchQuery,
      1,
      genreFilter,
      sortBy,
      authorFilter,
      availabilityFilter,
      languageFilter,
      formatFilter,
      priceRange,
      mainFilter
    );
  };

  const filters = [
    { id: "", name: "All Books" },
    { id: "new", name: "New Releases" },
    { id: "bestsellers", name: "Bestsellers" },
    { id: "comingsoon", name: "Coming soon" },
    { id: "sale", name: "On Sale" },
  ];
  // const [activeFilter, setActiveFilter] = useState("");

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => Math.max(1, prev + direction));
  };

  const handleAddToCart = async (book) => {
    try {
      const endpoint = `api/Cart/add?bookId=${book.bookId}&quantity=1`;

      const response = await apiClient.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Optionally, you can update cart state here if needed
      toast.success(`Added to cart: ${book.title}`);
      addToCart(book); // Assuming you have a function to update the cart in your context
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const handleAddToWhitelist = async (book) => {
    try {
      const endpoint = `api/Whitelist/add/${book.bookId}`;

      const response = await apiClient.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Added to Whitelist:", book.title);
    } catch (error) {
      console.error("Failed to add item to whitelist:", error);
    }
  };

  const [authorOptions, setAuthorOptions] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await apiClient.get("/api/Books/authors");
        const data = response.data?.data || [];
        setAuthorOptions(data);
      } catch (error) {
        console.error("Failed to fetch authors", error);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Book Catalog</h1>

        <form onSubmit={handleSearch} className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`px-4 py-1.5 text-sm rounded-full font-medium ${
                  mainFilter === filter.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => {
                  const selectedFilter = filter.id;
                  setMainFilter(selectedFilter);
                  console.log(selectedFilter, "selectedFilter");

                  fetchBooks(
                    searchQuery,
                    1,
                    genreFilter,
                    sortBy,
                    authorFilter,
                    availabilityFilter,
                    languageFilter,
                    formatFilter,
                    priceRange,
                    selectedFilter
                  );
                }}
              >
                {filter.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to read? Search by Title or ISBN"
                className="w-full px-4 py-2 border rounded-md pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Search className="text-gray-500" />
              </button>
            </div>

            <div className="min-w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => {
                  const selectedSort = e.target.value;
                  setSortBy(selectedSort);
                  setCurrentPage(1);
                  fetchBooks(
                    searchQuery,
                    1,
                    genreFilter,
                    selectedSort,
                    authorFilter,
                    availabilityFilter,
                    languageFilter,
                    formatFilter,
                    priceRange,
                    mainFilter
                  );
                }}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Sort By:</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="pub_date_asc">
                  Publication Date: Old to New
                </option>
                <option value="pub_date_desc">
                  Publication Date: New to Old
                </option>
                <option value="">New Arrival</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchQuery("");
                setGenreFilter("");
                setAuthorFilter("");
                setAvailabilityFilter("");
                setLanguageFilter("");
                setFormatFilter("");
                setPriceRange({ min: "", max: "" });
                setSortBy("");
                setCurrentPage(1);
                fetchBooks("", 1, "", "");
                setMainFilter("");
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Reset Filters
            </button>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="flex-1 min-w-[150px] max-w-[200px]">
              <label className="block mb-2 font-medium text-gray-700">
                Genre
              </label>
              <select
                value={genreFilter}
                onChange={(e) => {
                  const selectedGenre = e.target.value;
                  setGenreFilter(selectedGenre);
                  setCurrentPage(1);
                  fetchBooks(
                    searchQuery,
                    1,
                    selectedGenre,
                    sortBy,
                    authorFilter,
                    availabilityFilter,
                    languageFilter,
                    formatFilter,
                    priceRange,
                    mainFilter
                  );
                }}
                className="w-full px-4 py-2 border rounded-md"
              >
                {genreOptions.map((genre) => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px] max-w-[200px]">
              <label className="block mb-2 font-medium text-gray-700">
                Author
              </label>
              <select
                value={authorFilter}
                onChange={(e) => {
                  const selectedAuthor = e.target.value;
                  setAuthorFilter(selectedAuthor);
                  setCurrentPage(1);
                  fetchBooks(
                    searchQuery,
                    1,
                    genreFilter,
                    sortBy,
                    selectedAuthor,
                    availabilityFilter,
                    languageFilter,
                    formatFilter,
                    priceRange,
                    mainFilter
                  );
                }}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">All</option>
                {authorOptions.map((author) => (
                  <option key={author.value} value={author.value}>
                    {author.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px] max-w-[200px]">
              <label className="block mb-2 font-medium text-gray-700">
                Availability
              </label>
              <select
                value={availabilityFilter}
                onChange={(e) => {
                  const selectedAvailability = e.target.value;
                  setAvailabilityFilter(selectedAvailability);
                  fetchBooks(
                    searchQuery,
                    1,
                    genreFilter,
                    sortBy,
                    authorFilter,
                    selectedAvailability,
                    languageFilter,
                    formatFilter,
                    priceRange,
                    mainFilter
                  );
                }}
                className="w-full px-4 py-2 border rounded-md"
              >
                {availabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px] max-w-[200px]">
              <label className="block mb-2 font-medium text-gray-700">
                Language
              </label>
              <select
                value={languageFilter}
                onChange={(e) => {
                  const selectedLanguage = e.target.value;
                  setLanguageFilter(selectedLanguage);
                  fetchBooks(
                    searchQuery,
                    1,
                    genreFilter,
                    sortBy,
                    authorFilter,
                    availabilityFilter,
                    selectedLanguage,
                    formatFilter,
                    priceRange,
                    mainFilter
                  );
                }}
                className="w-full px-4 py-2 border rounded-md"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px] max-w-[200px]">
              <label className="block mb-2 font-medium text-gray-700">
                Format
              </label>
              <select
                value={formatFilter}
                onChange={(e) => {
                  const selectedFormat = e.target.value;
                  setFormatFilter(selectedFormat);
                  setCurrentPage(1);
                  fetchBooks(
                    searchQuery,
                    1,
                    genreFilter,
                    sortBy,
                    authorFilter,
                    availabilityFilter,
                    languageFilter,
                    selectedFormat,
                    priceRange,
                    mainFilter
                  );
                }}
                className="w-full px-4 py-2 border rounded-md"
              >
                {formatOptions.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px] max-w-[200px]">
              <label className="block mb-2 font-medium text-gray-700">
                Price Range
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => {
                    const minPrice = e.target.value;
                    setPriceRange({ ...priceRange, min: minPrice });
                    setCurrentPage(1);
                    fetchBooks(
                      searchQuery,
                      1,
                      genreFilter,
                      sortBy,
                      authorFilter,
                      availabilityFilter,
                      languageFilter,
                      formatFilter,
                      { ...priceRange, min: minPrice },
                      mainFilter
                    );
                  }}
                  min={0}
                  max={10000}
                  className="w-full px-4 py-2 border rounded-md"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => {
                    const maxPrice = e.target.value;
                    setPriceRange({ ...priceRange, max: maxPrice });
                    setCurrentPage(1);
                    fetchBooks(
                      searchQuery,
                      1,
                      genreFilter,
                      sortBy,
                      authorFilter,
                      availabilityFilter,
                      languageFilter,
                      formatFilter,
                      { ...priceRange, max: maxPrice },
                      mainFilter
                    );
                  }}
                  min={priceRange.min || 0}
                  max={10000}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        </form>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading books...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <>
            {books.length ? (
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
                    <p className="text-sm text-gray-600 mb-1">
                      by {book.author}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      Genre: {book.genre}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      Format: {book.format}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      ISBN: {book.isbn}
                    </p>
                    {!book.isStoreOnlyAccess && (
                      <p className="text-xs text-gray-500 mb-2">
                        Stock: {book.stockQuantity}
                      </p>
                    )}
                    <p className="font-bold mb-3 text-blue-600">
                      Rs. {book.price}
                    </p>
                    <div className="px-4 pb-4 flex justify-between gap-2">
                      {!book.isStoreOnlyAccess ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!currentUser) {
                              toast.error(
                                "Please log in to add books to cart."
                              );
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
                      ) : (
                        <p className="text-red-500 text-sm">Store Only</p>
                      )}
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
            ) : (
              <div className="text-center py-20">
                <h2 className="text-xl font-semibold mb-2">No books found</h2>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setGenreFilter("");
                    setAuthorFilter("");
                    setAvailabilityFilter("");
                    setLanguageFilter("");
                    setFormatFilter("");
                    setPriceRange({ min: "", max: "" });
                    setSortBy("");
                    setCurrentPage(1);
                    fetchBooks("", 1, "", "");
                    setMainFilter("");
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Reset Filters
                </button>
              </div>
            )}

            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => handlePageChange(-1)}
                disabled={currentPage === 1 || currentPage === 0}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-lg font-medium">
                Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
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
