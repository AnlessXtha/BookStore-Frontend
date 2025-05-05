import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Package, Clock, CheckCircle } from 'lucide-react';
import { createApiClient } from '../lib/createApiClient';
import { AuthContext } from '../context/AuthContext';

export function OrdersPage() {
    const { currentUser } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const [pendingOrders, setPendingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiClient = createApiClient("https://localhost:7086");

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const endpoint = 'api/Orders/my-orders';

            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            // Assuming the API returns all orders, we'll split them by status
            const allOrders = response.data || [];
            setPendingOrders(allOrders.filter(order => order.status === 'Pending' || order.status === 'Processing'));
            setCompletedOrders(allOrders.filter(order => order.status === 'Completed' || order.status === 'Delivered'));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch orders.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const cancelOrder = async (orderId) => {
        try {
            const endpoint = `api/Orders/cancel/${orderId}`;

            await apiClient.put(endpoint, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // Refresh orders after cancellation
            fetchOrders();
        } catch (error) {
            console.error("Failed to cancel order:", error);
        }
    };

    // Format the date in a readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

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
                            to="/catalog"
                            className="text-gray-600 hover:text-blue-600 active:text-blue-700"
                        >
                            Catalog
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

            <div className="mt-8">
                <h1 className="text-3xl font-lexend font-bold text-gray-900 mb-8 flex items-center">
                    <Package className="mr-2 h-8 w-8" /> My Orders
                </h1>

                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                        <p className="mt-2 text-gray-600">Loading your orders...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Pending Orders Section */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-medium text-gray-900 mb-4 flex items-center">
                                <Clock className="mr-2 h-6 w-6 text-yellow-500" /> Pending Orders
                            </h2>
                            
                            {pendingOrders.length === 0 ? (
                                <div className="bg-gray-50 rounded-lg p-6 text-center">
                                    <p className="text-gray-600">No pending orders at the moment.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    S.NO
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    In Stock
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Author
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Genre
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ISBN
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    IMG
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Operations
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pendingOrders.map((order, index) => (
                                                order.items.map((item, itemIndex) => (
                                                    <tr key={`${order.id}-${item.bookId}`}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {index + 1}.{itemIndex + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.stock}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.author}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.genre}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.isbn}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <img 
                                                                src={item.coverImage} 
                                                                alt={item.title} 
                                                                className="h-10 w-8 object-cover rounded"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            Rs {item.price}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => cancelOrder(order.id)}
                                                                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-xs"
                                                            >
                                                                Cancel Order
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Completed Orders Section */}
                        <div>
                            <h2 className="text-2xl font-medium text-gray-900 mb-4 flex items-center">
                                <CheckCircle className="mr-2 h-6 w-6 text-green-500" /> Purchased Books
                            </h2>
                            
                            {completedOrders.length === 0 ? (
                                <div className="bg-gray-50 rounded-lg p-6 text-center">
                                    <p className="text-gray-600">You haven't purchased any books yet.</p>
                                    <Link
                                        to="/catalog"
                                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Browse Catalog
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    S.NO
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    In Stock
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Author
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Genre
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ISBN
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    IMG
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {completedOrders.map((order, index) => (
                                                order.items.map((item, itemIndex) => (
                                                    <tr key={`${order.id}-${item.bookId}`}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {index + 1}.{itemIndex + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.stock}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.author}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.genre}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.isbn}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <img 
                                                                src={item.coverImage} 
                                                                alt={item.title} 
                                                                className="h-10 w-8 object-cover rounded"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            Rs {item.price}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatDate(order.orderDate)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default OrdersPage;