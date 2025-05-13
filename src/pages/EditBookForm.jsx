import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createApiClient } from "../lib/createApiClient";
import toast from "react-hot-toast";
import Sidebar from "./Admin/Sidebar";
import { genreOptions } from "../constants/genreOptions";

const EditBookForm = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const apiClient = createApiClient("https://localhost:7086");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    author: "",
    genre: "",
    language: "",
    publisher: "",
    format: "",
    isbn: "",
    stockQuantity: 0,
    price: 0,
    isAvailable: true,
    isStoreOnlyAccess: false,
    publicationDate: "",
    arrivalDate: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await apiClient.get(`/api/Books/${id}`);
        const book = res.data;
        setForm({
          title: book.title,
          description: book.description,
          author: book.author,
          genre: book.genre,
          language: book.language,
          publisher: book.publisher,
          format: book.format,
          isbn: book.isbn,
          stockQuantity: book.stockQuantity,
          price: book.price,
          isAvailable: book.isAvailable,
          isStoreOnlyAccess: false,
          publicationDate: book.publicationDate?.split("T")[0] || "",
          arrivalDate: book.arrivalDate?.split("T")[0] || "",
        });
        if (book.imagePath) {
          setPreview(`https://localhost:7086${book.imagePath}`);
        }
      } catch (err) {
        toast.error("Failed to load book.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "publicationDate") {
        const datetime = new Date(`${form[key]}T12:00:00`);
        formData.append(key, datetime.toISOString());
      } else {
        formData.append(key, form[key]);
      }
    });

    if (image) formData.append("image", image);

    try {
      await apiClient.put(`/api/Books/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Book updated successfully!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update book.");
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  if (loading) {
    return (
      <p className="text-center mt-8 text-lg text-gray-700">
        Loading book details...
      </p>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />

      <div className="w-[1200px] h-auto mx-auto p-6 border rounded-lg shadow-md bg-white mt-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
          Add New Book
        </h2>
        <form
          onSubmit={handleSubmit}
          className="md:flex md:gap-6 space-y-4 md:space-y-0"
        >
          <div className="md:flex-1 space-y-4">
            {/* Row 1: Title & Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Title
                </label>
                <input
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Author
                </label>
                <input
                  name="author"
                  type="text"
                  value={form.author}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Row 2: Genre & Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Genre
                </label>
                <select
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {genreOptions
                    .filter((option) => option.value !== "")
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Language
                </label>
                <input
                  name="language"
                  type="text"
                  value={form.language}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            {/* Row 3: Publisher & Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Publisher
                </label>
                <input
                  name="publisher"
                  type="text"
                  value={form.publisher}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Format
                </label>
                <input
                  name="format"
                  type="text"
                  value={form.format}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            {/* Row 4: ISBN (alone) */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                ISBN
              </label>
              <input
                name="isbn"
                type="text"
                value={form.isbn}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Row 5: Stock & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Stock Quantity
                </label>
                <input
                  name="stockQuantity"
                  type="number"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Price (NPR)
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            {/* Publication Date & Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Publication Date
                </label>
                <input
                  name="publicationDate"
                  type="date"
                  value={form.publicationDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Arrival Date
                </label>
                <input
                  name="arrivalDate"
                  type="date"
                  value={form.arrivalDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                  className="mr-2 accent-blue-700"
                />
                <label className="font-medium text-gray-700">Available</label>
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="isStoreOnlyAccess"
                  checked={form.isStoreOnlyAccess}
                  onChange={handleChange}
                  className="mr-2 accent-blue-700"
                />
                <label className="font-medium text-gray-700">
                  Store Only Access
                </label>
              </div>
            </div>
          </div>

          {/* Fancy Image Upload */}
          <div className=" md:flex-1 md:w-72 w-full h-full space-y-4">
            <label className="block mb-1 font-semibold text-gray-700">
              Upload Book Cover
            </label>
            <div className="border border-dashed h-156 w-auto border-gray-400 rounded-md p-4 flex flex-col items-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-90 h-180 object-cover mb-3 rounded shadow"
                />
              ) : (
                <p className="text-gray-500 mb-2">Drag or select image</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
        </form>
        <div className="flex justify-between gap-4 mt-12">
          <button
            type="button"
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded"
            onClick={handleSubmit}
            disabled={!form.title || !form.author || !form.genre || !image}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookForm;
