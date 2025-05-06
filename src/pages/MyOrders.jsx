import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const apiClient = createApiClient("https://localhost:7086");

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const endpoint = 'api/Orders';

            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // Check if response.data exists and handle accordingly
            const allOrders = response.data.data || [];

            // Filter orders based on status - case insensitive comparison
            const pending = allOrders.filter(order =>
                order.status === 'Pending' ||
                order.status === 'Processing'
            );

            const completed = allOrders.filter(order =>
                order.status === 'Completed' ||
                order.status === 'Delivered'
            );

            console.log("All Orders:", allOrders);
            console.log("Pending Orders:", pending);
            console.log("Completed Orders:", completed);

            setPendingOrders(pending);
            setCompletedOrders(completed);

        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.response?.data?.message || "Failed to fetch orders.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const viewDetails = async (orderId) => {
        navigate(`/orderdetails/${orderId}`)
    }

    const cancelOrder = async (orderId) => {
        try {
            const endpoint = `api/Orders/${orderId}/cancel`;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
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
                                                    Claim Code
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Number of books
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Discount Applied
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Bill Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Final Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Operations
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pendingOrders?.map((order, index) => {
                                                console.log("Processing order:", order); // Debug log
                                                // If order doesn't have items array, treat the order itself as an item
                                                const items = order.items || [order];
                                                return items.map((item, itemIndex) => (
                                                    <tr key={`${order.orderId}-${itemIndex}`}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.orderId}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.claimCode || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.orderItems.map(i => i.quantity) || 0}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.status || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            Rs {order.discountApplied || 0}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            Rs {order.billAmount || 0}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            Rs {order.finalAmount || 0}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            {/* <button
                                                                onClick={() => viewDetails(item.orderId)}
                                                                className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs"
                                                            >
                                                                View Details
                                                            </button> */}
                                                            <button
                                                                onClick={() => cancelOrder(item.orderId)}
                                                                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-xs"
                                                            >
                                                                Cancel Order
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ));
                                            })}
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
                                                    Claim Code
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Number of books
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Discount Applied
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Bill Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Final Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Operations
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {completedOrders?.map((order, itemIndex) => {
                                                console.log("Processing order:", order); // Debug log
                                                const items = order.items || [order];
                                                return items?.map((item, itemIndex) => (
                                                    <tr key={`${order.orderId}-${itemIndex}`}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.orderId}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.claimCode || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.orderItems.map(i => i.quantity) || 0}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.status || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            Rs {order.discountApplied || 0}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            Rs {item.price || order.billAmount || 0}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            Rs {order.finalAmount || 0}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => cancelOrder(order.orderId)}
                                                                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-xs"
                                                            >
                                                                Cancel Order
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ));
                                            })}
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