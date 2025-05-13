import React, { useContext, useEffect, useState } from "react";
import { Search, Plus, Filter, Edit, Trash2, SearchCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createApiClient } from "../../lib/createApiClient";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

export function BooksPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const token = localStorage.getItem("token");

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

      const response = await apiClient.get(
        "/api/Books?pageNumber=1&pageSize=10000"
      );
      setBooks(response.data.data || response.data);
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8  mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Book Inventory
            </h1>
            <button
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              onClick={() => handleAddBook()}
            >
              <Plus size={18} />
              Add New Book
            </button>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by title or author..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 ">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">Cover</th>
                  <th className="px-4 py-3 font-semibold">Book Details</th>
                  <th className="px-4 py-3 font-semibold">Genre</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBooks.map((book) => (
                  <tr key={book.bookId} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <img
                        src={`https://localhost:7086${book.imagePath} `}
                        alt={book.title}
                        className="w-14 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {book.title}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {book.author}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{book.genre}</td>
                    <td className="px-4 py-3 font-medium">Rs. {book.price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          book.stockQuantity > 10
                            ? "bg-green-100 text-green-800"
                            : book.stockQuantity > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.stockQuantity > 0
                          ? `${book.stockQuantity} In stock`
                          : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/edit-book/${book.bookId}`)
                          }
                          className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                          aria-label="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(book)}
                          className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBooks.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <SearchCheck size={24} className="text-gray-400 mb-2" />
                        <p>No books found. Try adjusting your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                "{bookToDelete?.title}"
              </span>
              ? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
