import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, RefreshCw, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { createApiClient } from '../../lib/createApiClient';
import Sidebar from './Sidebar';

const API_URL = 'https://api.bookstore.com';
const apiClient = createApiClient("https://localhost:7086");
const token = localStorage.getItem('token');

const bookService = {
    getAllBooks: async () => {
        try {
            console.log('Fetching books...');
            const response = await apiClient.get('/api/Books', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Books response:', response.data);
            return response.data || [];
        } catch (error) {
            console.error('Error in getAllBooks:', error);
            throw error;
        }
    },
};

const discountService = {
    getAllDiscounts: async () => {
        const response = await apiClient.get('/api/Discounts/get-all-discount', {
            headers: {
                'Content-Type': 'application/json',

                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data || [];
    },
    createDiscount: async (data) => {
        const response = await apiClient.post('/api/Discounts/create-discount', data, {
            headers: {
                'Content-Type': 'application/json',

                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    },
    updateDiscount: async (data) => {
        console.log('Update payload:', data);
        const response = await apiClient.put('/api/Discounts/update-discount', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    },
    deleteDiscount: async (id) => {
        await apiClient.delete(`/api/Discounts/delete-discount/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
};

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                {children}
            </div>
        </div>
    );
}

function DiscountForm({ discount, onSubmit, onCancel }) {
    const [books, setBooks] = useState([]);
        const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        id: discount?.discountId || null, // Change this line to use discountId
        bookId: discount?.bookId || '',
        discountPercent: discount?.discountPercent || '',
        startDate: discount?.startDate?.split('T')[0] || '',
        endDate: discount?.endDate?.split('T')[0] || ''
    });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setIsLoading(true);
                const booksData = await bookService.getAllBooks();
                console.log('Books data:', booksData); // Debug log
                setBooks(Array.isArray(booksData) ? booksData : []);
            } catch (error) {
                console.error('Error fetching books:', error);
                toast.error('Failed to load books');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            bookId: Number(formData.bookId),
            discountPercent: Number(formData.discountPercent)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Select Book</label>
                {isLoading ? (
                    <div className="text-gray-500">Loading books...</div>
                ) : (
                    <select
                        name="bookId"
                        value={formData.bookId}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    >
                        <option value="">Select a book</option>
                        {books.map(book => (
                            <option key={book.bookId} value={book.bookId}>
                                {book.title} - Rs{book.price} ({book.author})
                            </option>
                        ))}
                    </select>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Discount (%)</label>
                <input
                    type="number"
                    value={formData.discountPercent}
                    onChange={e => setFormData({ ...formData, discountPercent: e.target.value })}
                    className="w-full border rounded p-2"
                    required
                    min="1"
                    max="100"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                        type="date"
                        value={formData.endDate}
                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
                    {discount ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
}

function DiscountManagement() {
    const [discounts, setDiscounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);

    const fetchDiscounts = async () => {
        try {
            const data = await discountService.getAllDiscounts();
            setDiscounts(data);
        } catch (error) {
            toast.error('Failed to load discounts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);


    const handleSubmit = async (formData) => {
        try {
            console.log('Selected discount:', selectedDiscount);
            console.log('Form data:', formData);

            if (selectedDiscount) {
                console.log('Updating discount:', {
                    discountId: selectedDiscount.discountId, // Use discountId here
                    bookId: formData.bookId,
                    discountPercent: formData.discountPercent,
                    startDate: formData.startDate,
                    endDate: formData.endDate
                });

                await discountService.updateDiscount({
                    discountId: selectedDiscount.discountId, // Use discountId here
                    bookId: formData.bookId,
                    discountPercent: formData.discountPercent,
                    startDate: formData.startDate,
                    endDate: formData.endDate
                });
                toast.success('Discount updated successfully');
            } else {
                console.log('Creating new discount:', formData);
                const { id, ...createData } = formData;
                await discountService.createDiscount(createData);
                toast.success('Discount created successfully');
            }

            setIsModalOpen(false);
            setSelectedDiscount(null);
            fetchDiscounts();
        } catch (error) {
            console.error('Operation failed:', error);
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await discountService.deleteDiscount(id);
                toast.success('Discount deleted');
                fetchDiscounts();
            } catch (error) {
                console.error('Delete failed:', error);
                toast.error('Delete failed');
            }
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-64">
            <Sidebar />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Discount Management</h1>
                <button
                    onClick={() => {
                        setSelectedDiscount(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Discount
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {discounts.map(discount => (
                                <tr key={`discount-${discount.discountId}`}> {/* Add unique key */}
                                    <td className="px-6 py-4">{discount.bookId}</td>
                                    <td className="px-6 py-4">{discount.bookName}</td>
                                    <td className="px-6 py-4">{discount.discountPercent}%</td>
                                    <td className="px-6 py-4">
                                        {new Date(discount.startDate).toLocaleDateString()} -
                                        {new Date(discount.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedDiscount(discount);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(discount.discountId)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedDiscount ? 'Edit Discount' : 'New Discount'}
            >

                <DiscountForm
                    discount={selectedDiscount}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

        </div>
    );
}

export default DiscountManagement;