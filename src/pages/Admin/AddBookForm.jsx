import React, { useState } from "react";
import axios from "axios";
import { createApiClient } from "../../lib/createApiClient";

export function AddBookForm  ()  {
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
    publicationDate: "", // e.g., 2025-05-04
  });

  const [image, setImage] = useState(null);
  const [response, setResponse] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const apiClient = createApiClient("https://localhost:7086");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "publicationDate") {
        // Set 12:00 PM to date
        const datetime = new Date(`${form[key]}T12:00:00`);
        formData.append(key, datetime.toISOString());
      } else {
        formData.append(key, form[key]);
      }
    });

    if (image) formData.append("image", image);

    try {
      const res = await apiClient.post("/api/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse("Book added successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setResponse("Failed to add book.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          "title",
          "author",
          "genre",
          "language",
          "publisher",
          "format",
          "isbn",
        ].map((field) => (
          <input
            key={field}
            name={field}
            type="text"
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        ))}

        <input
          type="number"
          name="stockQuantity"
          placeholder="Stock Quantity"
          value={form.stockQuantity}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <label className="block">
          Publication Date:
          <input
            type="date"
            name="publicationDate"
            value={form.publicationDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block">
          Available:
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
            className="ml-2"
          />
        </label>

        <label className="block">
          Upload Book Cover:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-1"
          />
        </label>

        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      {response && <p className="mt-4">{response}</p>}
    </div>
  );
};

