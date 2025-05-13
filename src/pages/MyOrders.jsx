import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Package, Clock, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { createApiClient } from "../lib/createApiClient";

export function OrdersPage() {
  const { currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiClient = createApiClient("https://localhost:7086");

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const endpoint = "api/Orders";
      const response = await apiClient.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allOrders = response.data.data || [];
      const pending = allOrders.filter(order => 
        order.status === "Pending" || order.status === "Processing"
      );
      const completed = allOrders.filter(order => 
        order.status === "Completed" || order.status === "Delivered"
      );

      setPendingOrders(pending);
      setCompletedOrders(completed);
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
      await apiClient.put(`api/Orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to cancel order:", error);
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

  const OrderRow = ({ order, isExpanded, onToggle }) => (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {order.orderId}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            Claim Code: {order.claimCode}
          </div>
          <div className="text-sm text-gray-500">
            {formatDate(order.orderDate)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            order.status === "Completed" ? "bg-green-100 text-green-800" : 
            order.status === "Processing" ? "bg-blue-100 text-blue-800" : 
            "bg-yellow-100 text-yellow-800"
          }`}>
            {order.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          Rs {order.discountApplied.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          Rs {order.billAmount.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          Rs {order.finalAmount.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
          <button
            onClick={onToggle}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {order.status !== "Completed" && (
            <button
              onClick={() => cancelOrder(order.orderId)}
              className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded text-xs transition-colors"
            >
              Cancel
            </button>
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan={8} className="px-6 py-4">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Order Details</h4>
              <div className="bg-white rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Title</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.bookTitle}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">Rs {item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          Rs {(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Subtotal:</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Rs {order.billAmount.toFixed(2)}</td>
                    </tr>
                    {order.discountApplied > 0 && (
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-4 py-3 text-sm font-medium text-green-600 text-right">Discount:</td>
                        <td className="px-4 py-3 text-sm font-medium text-green-600">- Rs {order.discountApplied.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900 text-right">Final Total:</td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">Rs {order.finalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );

  const OrdersTable = ({ orders, title, icon: Icon, iconColor }) => (
    <div className="mb-12">
      <h2 className="text-2xl font-medium text-gray-900 mb-4 flex items-center">
        <Icon className={`mr-2 h-6 w-6 ${iconColor}`} /> {title}
      </h2>

      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">No {title.toLowerCase()} at the moment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <OrderRow
                  key={order.orderId}
                  order={order}
                  isExpanded={expandedOrders.has(order.orderId)}
                  onToggle={() => toggleOrderDetails(order.orderId)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <Package className="mr-2 h-8 w-8" /> My Orders
      </h1>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          <OrdersTable
            orders={pendingOrders}
            title="Pending Orders"
            icon={Clock}
            iconColor="text-yellow-500"
          />
          <OrdersTable
            orders={completedOrders}
            title="Completed Orders"
            icon={CheckCircle}
            iconColor="text-green-500"
          />
        </>
      )}
    </div>
  );
}

export default OrdersPage;