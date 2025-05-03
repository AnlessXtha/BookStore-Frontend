import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { Bookmark, ShoppingCart, User } from 'lucide-react';

function Navbar() {
    const { currentUser } = useContext(AuthContext);

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
                        {/* Cart Icon with Badge */}
                        <Link
                            to="/cart"
                            className="relative text-gray-500 hover:text-gray-700"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                                {/* {cart.length} */}
                            </span>
                        </Link>
                        <Link
                            to="/whitelist"
                            className="text-gray-600 hover:text-blue-600 active:text-blue-700"
                        >
                            <Bookmark />
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
        </div>
    )
}

export default Navbar