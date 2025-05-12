import React, { useContext, useEffect, useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { createApiClient } from "../../lib/createApiClient";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

export function BooksPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const filters = [
    { id: "all", name: "All Books" },
    { id: "new", name: "New Releases" },
    { id: "bestsellers", name: "Bestsellers" },
    { id: "sale", name: "On Sale" },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (activeFilter === "new") return matchesSearch && book.isNew;
    return matchesSearch;
  });

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
      toast.error(err.response?.data?.message || "Failed to fetch books.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  const handleAddBook = () => {
    navigate("/admin/add-book");
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    try {
      const res = await apiClient.delete(`/api/Books/${bookToDelete.bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(`Deleted "${bookToDelete.title}"`);
      fetchBooks(searchQuery, currentPage);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete book.");
    } finally {
      setShowDeleteDialog(false);
      setBookToDelete(null);
    }
  };

  const cancelDelete = () => {
    setBookToDelete(null);
    setShowDeleteDialog(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full md:w-80 pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddBook}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus size={20} />
                Add Book
              </button>
              <button
                className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
                Filters
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  ${
                    activeFilter === filter.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.name}
              </button>
            ))}
          </div>

          <div className="overflow-auto">
            <table className="min-w-full table-auto border rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  <th className="p-3">Cover</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Genre</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks?.map((book) => (
                  <tr key={book.bookId} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="p-3 font-medium">{book.title}</td>
                    <td className="p-3 text-gray-600">{book.author}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">{book.genre}</div>
                    </td>
                    <td className="p-3 font-semibold">Rs. {book.price}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          book.stock > 10
                            ? "bg-green-100 text-green-800"
                            : book.stock > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.stock} in stock
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => {
                          navigate(`/admin/edit-book/${book.bookId}`);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(book)}
                        className="px-3 py-1 border border-red-600 text-red-600 text-sm rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBooks.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-bold text-red-600">
                "{bookToDelete?.title}"
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
