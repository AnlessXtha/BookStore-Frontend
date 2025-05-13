import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ShoppingCart, User, Plus, Minus } from "lucide-react";
import { createApiClient } from "../lib/createApiClient";
import { AuthContext } from "../context/AuthContext";

export function CartPage() {
  const { currentUser, updateCart } = useContext(AuthContext);

  const token = localStorage.getItem("token");

  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiClient = createApiClient("https://localhost:7086");

  const fetchCartItems = async (query = "", page = 1) => {
    setIsLoading(true);
    try {
      const endpoint = "api/Cart/my-cart";

      const response = await apiClient.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data.data || response.data);
      updateCart(response.data.data || response.data);

      console.log(cart);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch books.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems(searchQuery);
  }, [searchQuery]);

  const increaseQuantity = async (bookId) => {
    try {
      const endpoint = `api/Cart/increase/${bookId}`;

      await apiClient.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(
        cart.map((item) =>
          item.bookId === bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  const decreaseQuantity = async (bookId) => {
    try {
      const endpoint = `api/Cart/decrease/${bookId}`;

      await apiClient.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart((cart) => {
        const item = cart.find((i) => i.bookId === bookId);
        if (!item) return cart;

        if (item.quantity > 1) {
          return cart.map((i) =>
            i.bookId === bookId ? { ...i, quantity: i.quantity - 1 } : i
          );
        } else {
          // Remove item entirely if quantity reaches 0
          return cart.filter((i) => i.bookId !== bookId);
        }
      });
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  };

  const removeItem = async (bookId) => {
    try {
      const endpoint = `api/Cart/remove/${bookId}`;

      const response = await apiClient.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Optimistically update UI after success
      setCart(cart.filter((item) => item.bookId !== bookId));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const subtotal = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0)
    : 0;
  const discount = cart.length >= 5 ? subtotal * 0.05 : 0;
  const total = subtotal - discount;

  const checkout = async () => {
    try {
      const token = localStorage.getItem("token");
      const orderItems = cart.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
        bookTitle: item.title
      }));

      const response = await apiClient.post(
        "/add",
        { orderItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCart([]); // clear cart in frontend
        navigate("/myorders");
      } else {
        alert("Checkout failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-semibold text-gray-900">My Cart</h1>
        </div>

        {cart?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some books to get started!</p>
            <Link
              to="/catalog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            <div className="lg:col-span-7">
              <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
                {cart?.map((item) => (
                  <li key={item.bookId} className="p-6 sm:p-8 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-24 h-32 sm:w-32 sm:h-44 object-cover rounded-lg shadow-sm transition-transform hover:scale-105"
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between">
                          <div>
                            <Link
                              to={`/book/${item.bookId}`}
                              className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                            >
                              {item.title}
                            </Link>
                            <p className="mt-1 text-sm text-gray-500">{item.author}</p>
                            <p className="mt-2 text-lg font-semibold text-gray-900">
                              Rs. {item.originalPrice.toLocaleString()}
                            </p>
                            <p className="mt-2 text-lg font-semibold text-gray-900">
                              Rs. {item.finalPrice.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.bookId)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          >
                            <span className="sr-only">Remove</span>
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mt-4 sm:mt-auto">
                          <div className="inline-flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => decreaseQuantity(item.bookId)}
                              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              readOnly
                              className="w-16 text-center border-x border-gray-200 py-2 text-gray-900 focus:ring-0"
                            />
                            <button
                              onClick={() => increaseQuantity(item.bookId)}
                              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 lg:mt-0 lg:col-span-5">
              <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">Total</p>
                    <p className="text-lg font-semibold text-gray-900">Rs. {total}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={checkout}
                  className="mt-8 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </button>

                <p className="mt-4 text-center text-sm text-gray-500">
                  or{" "}
                  <Link to="/catalog" className="text-blue-600 hover:text-blue-700 font-medium">
                    Continue Shopping
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}