import React, { useState, useEffect, useContext } from 'react';
import { Bookmark, Trash2, Clock, AlertCircle, Check, X, Filter, SortDesc, BookOpen, ShoppingCart, User } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { createApiClient } from '../lib/createApiClient';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function Whitelist() {
    const { currentUser } = useContext(AuthContext);

    const token = localStorage.getItem("token");

    const [whitelistedBooks, setWhitelistedBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('dateAdded');
    const [filterAvailable, setFilterAvailable] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const apiClient = createApiClient("https://localhost:7086");


    useEffect(() => {
        const fetchWhitelist = async () => {
            try {
                const endpoint = 'api/Whitelist/my-whitelist';

                const response = await apiClient.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    }
                });

                setWhitelistedBooks(response.data);
            } catch (error) {
                console.error('Error fetching whitelist:', error);
                toast.error('Failed to load your bookmarks');
            } finally {
                setIsLoading(false);
            }
        };
        fetchWhitelist();
    }, []);


    const handleRemoveFromWhitelist = async (bookId) => {
        try {
            const endpoint = `api/Whitelist/remove/${bookId}`;

            const response = await apiClient.delete(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`, // make sure token is coming from currentUser
                }
            });

            setWhitelistedBooks(whitelistedBooks.filter(book => book.bookId !== bookId));
            toast.success('Book removed from bookmarks');
        } catch (error) {
            console.error('Error removing from whitelist:', error);
            toast.error('Failed to remove book from bookmarks');
        }
    };

    const sortBooks = (books) => {
        return [...books].sort((a, b) => {
            switch (sortBy) {
                case 'dateAdded':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'price':
                    return a.price - b.price;
                default:
                    return 0;
            }
        });
    };

    const filterBooks = (books) => {
        if (filterAvailable === 'available') {
            return books.filter(book => book.isAvailable);
        }
        if (filterAvailable === 'unavailable') {
            return books.filter(book => !book.isAvailable);
        }
        return books;
    };

    const displayBooks = filterBooks(sortBooks(whitelistedBooks));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <Bookmark className="h-7 w-7 text-indigo-600" />
                    <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {whitelistedBooks.length} saved
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-500 transition"
                    >
                        <Filter className="h-4 w-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 animate-fadeIn">
                    <div className="flex flex-wrap gap-6">
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="dateAdded">Date Added</option>
                                <option value="title">Title</option>
                                <option value="price">Price</option>
                            </select>
                        </div>

                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                            <select
                                value={filterAvailable}
                                onChange={(e) => setFilterAvailable(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All</option>
                                <option value="available">Available</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600"></div>
                </div>
            ) : displayBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayBooks?.map((book) => (
                        <div
                            key={book.bookId}
                            className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
                        >
                            <div className="relative h-52">
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="object-cover w-full h-full"
                                />
                                <button
                                    onClick={() => handleRemoveFromWhitelist(book.bookId)}
                                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-red-100"
                                    title="Remove from bookmarks"
                                >
                                    <Trash2 className="h-5 w-5 text-red-600" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={book.title}>
                                    {book.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2 truncate">{book.author}</p>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-base font-semibold text-gray-900">Rs {book?.price?.toFixed(2)}</span>
                                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${book.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {book.isAvailable ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                        {book.isAvailable ? 'Available' : 'Out of Stock'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="h-4 w-4" />
                                        {book.format}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {format(new Date(book.dateAdded), 'MMM d, yyyy')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No bookmarks yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Your bookmarked books will appear here.</p>
                </div>
            )}
        </div>
    );

};

