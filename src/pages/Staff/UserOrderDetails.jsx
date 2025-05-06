import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Search, Boxes } from 'lucide-react';
import { createApiClient } from '../../lib/createApiClient';
import { useLocation } from 'react-router-dom';

function OrderDetails() {
    const [orders, setOrders] = useState([]);
    const [claimCode, setClaimCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const location = useLocation();
    const userId = location.state?.userId;
    const userName = location.state?.userName;

    const token = localStorage.getItem("token");
    const apiClient = createApiClient("https://localhost:7086");

    useEffect(() => {
        if (userId) {
            fetchOrders(userId);
        }
    }, [userId]);

    const fetchOrders = async (userId) => {
        try {
            const endpoint = 'api/Orders/by-user-id';
            const response = await apiClient.post(endpoint, { userId }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setOrders(response.data.data || []);
        } catch (err) {
            setError('Failed to fetch orders');
            console.error('Error fetching orders:', err);
        }
    };

    const handleCompleteOrder = async (orderId) => {
        if (!claimCode) {
            setError('Please enter the claim code');
            return;
        }

        setLoading(true);
        try {
            const endpoint = `api/Orders/${orderId}/complete`;
            const response = await apiClient.post(endpoint,
                { claimCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setSuccess('Order completed successfully');
                fetchOrders(userId);
                setClaimCode('');
                setSelectedOrder(null);
            } else {
                setError(response.data.message || 'Failed to complete order');
            }
        } catch (err) {
            setError('Failed to complete order');
            console.error('Error completing order:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!userId) {
        return <div className="p-4 text-center text-gray-600">No user selected</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <Boxes className="h-8 w-8" />
                User Order Details
            </h1>
            <p className="text-gray-600 mb-4">User ID: {userId}</p>
            <p className="text-gray-600 mb-4">User Name: {userName}</p>
            <p className="text-gray-600 mb-4">Total Orders: {orders.length}</p>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p className="text-green-600">{success}</p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.orderId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.orderId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.orderDate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Rs {order.finalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {order.status === 'Pending' && (
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-blue-600 hover:text-blue-900 font-medium"
                                            >
                                                Complete Order
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Complete Order #{selectedOrder.orderId}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter Claim Code
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={claimCode}
                                        onChange={(e) => setClaimCode(e.target.value)}
                                        placeholder="Enter claim code"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => {
                                        setSelectedOrder(null);
                                        setClaimCode('');
                                        setError('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleCompleteOrder(selectedOrder.orderId)}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Complete Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderDetails;