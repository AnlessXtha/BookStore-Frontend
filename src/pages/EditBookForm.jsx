import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createApiClient } from "../lib/createApiClient";
import toast from "react-hot-toast";

const EditBookForm = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const apiClient = createApiClient("https://localhost:7086");

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    language: "",
    publisher: "",
    format: "",
    isbn: "",
    stockQuantity: 0,
    price: 0,
    isAvailable: true,
    publicationDate: "",
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
          author: book.author,
          genre: book.genre,
          language: book.language,
          publisher: book.publisher,
          format: book.format,
          isbn: book.isbn,
          stockQuantity: book.stockQuantity,
          price: book.price,
          isAvailable: book.isAvailable,
          publicationDate: book.publicationDate?.split("T")[0] || "",
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
      navigate("/admin/books");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update book.");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-8 text-lg text-gray-700">
        Loading book details...
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-md bg-white mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
        Edit Book
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Genre
            </label>
            <input
              name="genre"
              type="text"
              value={form.genre}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
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

        <div>
          <label className="block mb-1 font-semibold text-gray-700">ISBN</label>
          <input
            name="isbn"
            type="text"
            value={form.isbn}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

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
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
              className="mr-2 accent-blue-700"
            />
            <label className="font-medium text-gray-700">Available</label>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Upload New Book Cover
          </label>
          <div className="border border-dashed border-gray-400 rounded-md p-4 flex flex-col items-center">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-60 object-cover mb-3 rounded shadow"
              />
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
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded"
        >
          Update Book
        </button>
      </form>
    </div>
  );
};

export default EditBookForm;
