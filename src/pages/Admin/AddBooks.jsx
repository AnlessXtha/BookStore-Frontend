import React, { useState } from 'react';

export function AddBookForm () {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    language: '',
    publisher: '',
    format: '',
    isbn: '',
    stockQuantity: '',
    price: '',
    isAvailable: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace this with your actual API call
    console.log('Submitted book data:', formData);
    alert('Book submitted!');
    // Reset form
    setFormData({
      title: '',
      author: '',
      genre: '',
      language: '',
      publisher: '',
      format: '',
      isbn: '',
      stockQuantity: '',
      price: '',
      isAvailable: false,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Book</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Title', name: 'title' },
          { label: 'Author', name: 'author' },
          { label: 'Genre', name: 'genre' },
          { label: 'Language', name: 'language' },
          { label: 'Publisher', name: 'publisher' },
          { label: 'Format', name: 'format' },
          { label: 'ISBN', name: 'isbn' },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        ))}

        <div>
          <label className="block font-medium mb-1">Stock Quantity</label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="col-span-full flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="font-medium">Is Available</label>
        </div>

        <div className="col-span-full">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
};

