import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { createApiClient } from '../lib/createApiClient';
import { AuthContext } from '../context/AuthContext';

export function CartPage() {
    const { currentUser } = useContext(AuthContext);

    const token = localStorage.getItem("token");

    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiClient = createApiClient("https://localhost:7086");

    const fetchCartItems = async (query = "", page = 1) => {
        setIsLoading(true);
        try {
            const endpoint = 'api/Cart/my-cart';

            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setCart(response.data.data || response.data);
            console.log(cart)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch books.");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchCartItems(searchQuery);
    }, [searchQuery]);


    const updateQuantity = async (bookId, newQuantity) => {
        try {
            console.log(bookId, newQuantity)
            const endpoint = `api/Cart/addQuantity?bookId=${bookId}&quantity=${newQuantity}`;

            const response = await apiClient.post(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (newQuantity < 1) return;
            setCart(cart.map(item =>
                item.bookId === bookId ? { ...item, quantity: newQuantity } : item
            ));
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    }

    const removeItem = async (bookId) => {
        try {
            const endpoint = `api/Cart/remove/${bookId}`;

            const response = await apiClient.delete(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // Optimistically update UI after success
            setCart(cart.filter(item => item.bookId !== bookId));
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    const subtotal = Array.isArray(cart)
        ? cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        : 0;
    const discount = cart.length >= 5 ? subtotal * 0.05 : 0;
    const total = subtotal - discount;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex  flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
                <h2 className="mt-4 text-2xl  text-gray-900">Your cart is empty</h2>
                <p className="mt-2 text-gray-600">Add some books to get started!</p>
                <Link
                    to="/catalog"
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Browse Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-700">CoverToCover</h1>
                    <nav className="flex items-center space-x-6">
                        {/* Cart Icon with Badge */}
                        <Link
                            to="/cart"
                            className="relative text-gray-500 hover:text-gray-700"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                                {cart.length}
                            </span>
                        </Link>

                        {/* Home Link */}
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-blue-600 active:text-blue-700"
                        >
                            Home
                        </Link>

                        {/* Catalogue Link */}
                        <Link
                            to="/catalogue"
                            className="text-gray-600 hover:text-blue-600 active:text-blue-700"
                        >
                            Catalogue
                        </Link>

                        {/* About Link */}
                        <Link
                            to="/about"
                            className="text-gray-600 hover:text-blue-600 active:text-blue-700"
                        >
                            About
                        </Link>

                        {/* Contact Link */}
                        <Link
                            to="/contact"
                            className="text-gray-600 hover:text-blue-600 active:text-blue-700"
                        >
                            Contact
                        </Link>

                        {currentUser ? (
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-blue-600 active:text-blue-700 flex items-center gap-2"
                            >
                                <User className="h-6 w-6" />
                                {currentUser?.firstName} {currentUser?.lastName}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-blue-600 active:text-blue-700"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="text-gray-600 hover:text-blue-600 active:text-blue-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <h1 className="text-3xl font-lexend text-lg-bold text-gray-900">Shopping Cart</h1>

            <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                <div className="lg:col-span-7">
                    <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
                        {cart?.map((item) => (
                            <li key={item.bookId} className="flex py-6 sm:py-10">
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.coverImage}
                                        alt={item.title}
                                        className="w-24 h-24 object-cover object-center rounded-md"
                                    />
                                </div>

                                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                        <div>
                                            <div className="flex justify-between">
                                                <h3 className="text-sm">
                                                    <Link
                                                        to={`/book/${item.bookId}`}
                                                        className="font-medium text-gray-700 hover:text-gray-800"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </h3>
                                            </div>
                                            <div className="mt-1 flex text-sm">
                                                <p className="text-gray-500">{item.author}</p>
                                            </div>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {item.price}
                                            </p>
                                        </div>

                                        <div className="mt-4 sm:mt-0 sm:pr-9">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                                                    className="p-1 text-gray-400 hover:text-gray-500"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.bookId, parseInt(e.target.value))}
                                                    className="mx-2 w-16 text-center border-gray-300 rounded-md"
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                                                    className="p-1 text-gray-400 hover:text-gray-500"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="absolute top-0 right-0">
                                                <button
                                                    onClick={() => removeItem(item.bookId)}
                                                    className="text-gray-400 hover:text-gray-500"
                                                >
                                                    <span className="sr-only">Remove</span>
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-16 lg:mt-0 lg:col-span-5">
                    <div className="bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
                        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Subtotal</p>
                                <p className="text-sm font-medium text-gray-900">{subtotal}</p>
                            </div>
                            {discount > 0 && (
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">5% discount (5+ books)</p>
                                    <p className="text-sm font-medium text-green-600">-{discount}</p>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <p className="text-base font-medium text-gray-900">Order total</p>
                                <p className="text-base font-medium text-gray-900">{total}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
