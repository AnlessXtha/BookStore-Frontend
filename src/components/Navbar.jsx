import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Bell, Bookmark, ShoppingCart, User } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const { currentUser, cart, updateUser } = useContext(AuthContext);

  console.log("Current User:", currentUser);
  console.log("Cart Items:", cart);

  const token = localStorage.getItem("token");
  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">CoverToCover</h1>
          <nav className="flex items-center space-x-6">
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

            <Link
              to="/myorders"
              className="text-gray-600 hover:text-blue-600 active:text-blue-700"
            >
              Orders
            </Link>

            <Link
              to="/cart"
              className="relative text-gray-500 hover:text-gray-700"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                {cart.length}
              </span>
            </Link>
            <Link
              to="/whitelist"
              className="text-gray-600 hover:text-blue-600 active:text-blue-700"
            >
              <Bookmark />
            </Link>
            <Link
              to="/active-banner-announcements"
              className="text-gray-600 hover:text-blue-600 active:text-blue-700"
            >
              <Bell />
            </Link>

            {currentUser ? (
              <>
                <Link
                  to="/user-profile"
                  className="text-gray-600 hover:text-blue-600 active:text-blue-700 flex items-center gap-2"
                >
                  <User className="h-6 w-6" />
                  {currentUser?.firstName} {currentUser?.lastName}
                </Link>

                <button
                  className="text-white bg-blue-600 p-2 rounded-4xl hover:text-gray-100 active:text-blue-700"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("cart");
                    navigate("/");

                    updateUser(null);
                  }}
                >
                  Log out
                </button>
              </>
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
    </div>
  );
}

export default Navbar;
