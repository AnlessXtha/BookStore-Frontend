import { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Package, ArrowLeft, Clock, CheckCircle, Truck, AlertTriangle } from 'lucide-react';
import { createApiClient } from '../lib/createApiClient';
import { AuthContext } from '../context/AuthContext';

export function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const [order, setOrder] = useState(null);
    const [orderCount, setOrderCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiClient = createApiClient("https://localhost:7086");

    // Fetch order details and user's order count
    useEffect(() => {
        const fetchOrderDetails = async () => {
            setIsLoading(true);
            try {
                // Fetch specific order details
<<<<<<< HEAD
                const orderEndpoint = `api/Orders/${orderId}`;
=======
                const orderEndpoint = `api/Orders`;
>>>>>>> b3acdfd80fb5f37ce8afd94ff35a49d62e48f4b8
                const orderResponse = await apiClient.get(orderEndpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                
                setOrder(orderResponse.data);
                
                // Fetch user's total completed order count
                const countEndpoint = 'api/Orders/count';
                const countResponse = await apiClient.get(countEndpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                
                setOrderCount(countResponse.data.count || 0);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch order details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId, token]);

    // Format date in a readable format
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Calculate discounts and total
    const calculateOrderSummary = (order) => {
        if (!order || !order.items || order.items.length === 0) {
            return { subtotal: 0, bookDiscount: 0, loyaltyDiscount: 0, total: 0 };
        }

        // Calculate subtotal
        const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Calculate book quantity discount (5% for 5+ books)
        const totalBooks = order.items.reduce((sum, item) => sum + item.quantity, 0);
        const bookDiscount = totalBooks >= 5 ? subtotal * 0.05 : 0;
        
        // Calculate loyalty discount (10% for 11th order)
        // We use orderCount + 1 if the current order is still pending (not counted in completed orders yet)
        const isEligibleForLoyaltyDiscount = 
            (orderCount % 10 === 0 && orderCount > 0) || 
            (order.status === 'Pending' && (orderCount + 1) % 10 === 0 && orderCount > 0);
            
        const loyaltyDiscount = isEligibleForLoyaltyDiscount ? subtotal * 0.1 : 0;
        
        // Calculate total after discounts
        const total = subtotal - bookDiscount - loyaltyDiscount;
        
        return { subtotal, bookDiscount, loyaltyDiscount, total };
    };

    // Get status icon and color based on order status
    const getStatusDetails = (status) => {
        switch (status) {
            case 'Pending':
                return { icon: <Clock className="h-5 w-5" />, color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
            case 'Processing':
                return { icon: <Package className="h-5 w-5" />, color: 'text-blue-500', bgColor: 'bg-blue-100' };
            case 'Shipped':
                return { icon: <Truck className="h-5 w-5" />, color: 'text-indigo-500', bgColor: 'bg-indigo-100' };
            case 'Delivered':
                return { icon: <CheckCircle className="h-5 w-5" />, color: 'text-green-500', bgColor: 'bg-green-100' };
            case 'Cancelled':
                return { icon: <AlertTriangle className="h-5 w-5" />, color: 'text-red-500', bgColor: 'bg-red-100' };
            default:
                return { icon: <Clock className="h-5 w-5" />, color: 'text-gray-500', bgColor: 'bg-gray-100' };
        }
    };

    // Handle order cancellation
    const cancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        try {
            const endpoint = `api/Orders/cancel/${orderId}`;
            await apiClient.put(endpoint, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            // Refresh order details
            const orderEndpoint = `api/Orders/${orderId}`;
            const orderResponse = await apiClient.get(orderEndpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            setOrder(orderResponse.data);
        } catch (error) {
            console.error("Failed to cancel order:", error);
            setError("Failed to cancel order. Please try again.");
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                    <h2 className="mt-4 text-lg font-medium text-red-800">Error Loading Order</h2>
                    <p className="mt-2 text-red-700">{error}</p>
                    <button 
                        onClick={() => navigate('/orders')}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    // Show 404 state if order not found
    if (!order) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                    <h2 className="mt-4 text-lg font-medium text-gray-900">Order Not Found</h2>
                    <p className="mt-2 text-gray-600">The order you're looking for doesn't exist or you may not have permission to view it.</p>
                    <button 
                        onClick={() => navigate('/orders')}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const statusDetails = getStatusDetails(order.status);
    const { subtotal, bookDiscount, loyaltyDiscount, total } = calculateOrderSummary(order);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-700">CoverToCover</h1>
                    <nav className="flex items-center space-x-6">
                        {/* Cart Icon */}
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
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => navigate('/orders')}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        Back to Orders
                    </button>
                    <h1 className="text-2xl font-lexend font-bold text-gray-900">Order #{order.orderNumber || order.id}</h1>
                </div>

                {/* Order Status and Summary Card */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Placed on {formatDate(order.orderDate)}
                            </p>
                        </div>
                        <div className={`flex items-center px-3 py-1 rounded-full ${statusDetails.bgColor}`}>
                            <span className={`mr-2 ${statusDetails.color}`}>{statusDetails.icon}</span>
                            <span className={`font-medium ${statusDetails.color}`}>{order.status}</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                                <dd className="mt-1 text-sm text-gray-900">{order.id}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                                <dd className="mt-1 text-sm text-gray-900">{order.paymentMethod || "Card"}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {order.shippingAddress || `${currentUser?.firstName} ${currentUser?.lastName}, Default Address`}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Contact</dt>
                                <dd className="mt-1 text-sm text-gray-900">{order.contactEmail || currentUser?.email}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Book
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Author
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {order.items.map((item) => (
                                    <tr key={item.bookId}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img 
                                                        className="h-10 w-10 object-cover rounded-md" 
                                                        src={item.coverImage} 
                                                        alt={item.title} 
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                                    <div className="text-sm text-gray-500">ISBN: {item.isbn}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.author}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            Rs {item.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Rs {item.price * item.quantity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Order Summary with Pricing */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Summary</h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Subtotal</dt>
                                <dd className="text-sm font-medium text-gray-900">Rs {subtotal.toFixed(2)}</dd>
                            </div>
                            
                            {bookDiscount > 0 && (
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">5% discount (5+ books)</dt>
                                    <dd className="text-sm font-medium text-green-600">-Rs {bookDiscount.toFixed(2)}</dd>
                                </div>
                            )}
                            
                            {loyaltyDiscount > 0 && (
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-600">10% loyalty discount (11th order)</dt>
                                    <dd className="text-sm font-medium text-green-600">-Rs {loyaltyDiscount.toFixed(2)}</dd>
                                </div>
                            )}

                            <div className="pt-3 border-t border-gray-200 flex justify-between">
                                <dt className="text-base font-bold text-gray-900">Order Total</dt>
                                <dd className="text-base font-bold text-gray-900">Rs {total.toFixed(2)}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Action Buttons */}
                {order.status === 'Pending' && (
                    <div className="flex justify-end">
                        <button
                            onClick={cancelOrder}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                        >
                            Cancel Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderDetails;