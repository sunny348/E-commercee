import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { cart, getCartItemsCount } = useCart();
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 h-16">
                <div className="flex items-center justify-between h-full">
                    <Link
                        to="/"
                        className="text-[22px] font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hover:from-gray-700 hover:to-gray-500 transition-all duration-200"
                    >
                        ecomm
                    </Link>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center justify-center px-4 h-9 text-[15px] font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                                >
                                    <i className="fas fa-store text-gray-400 mr-2"></i>
                                    Shop
                                </Link>
                                <Link
                                    to="/cart"
                                    className="relative inline-flex items-center justify-center w-9 h-9 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                                >
                                    <i className="fas fa-shopping-cart text-[16px]"></i>
                                    {cart && cart.length > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[11px] font-medium h-5 min-w-[20px] flex items-center justify-center rounded-full px-1.5 ring-2 ring-white">
                                            {getCartItemsCount()}
                                        </span>
                                    )}
                                </Link>
                                <div className="relative group">
                                    <button className="flex items-center gap-3 px-3 h-9 rounded-lg hover:bg-gray-100/80 transition-all duration-200">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center text-[14px] font-medium text-white ring-2 ring-white">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-[14px] font-medium text-gray-700 group-hover:text-gray-900">
                                            {user.name}
                                        </span>
                                        <i className="fas fa-chevron-down text-[10px] text-gray-400 group-hover:text-gray-600 transition-colors"></i>
                                    </button>

                                    <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-2 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-[14px] font-medium text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div className="py-2">
                                            {[
                                                ['Profile', 'user-circle'],
                                                ['Orders', 'box'],
                                                ['Settings', 'cog']
                                            ].map(([label, icon]) => (
                                                <Link
                                                    key={label}
                                                    to={`/${label.toLowerCase()}`}
                                                    className="flex items-center gap-3 px-4 py-2 text-[14px] text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                >
                                                    <i className={`fas fa-${icon} w-4 text-gray-400`}></i>
                                                    {label}
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="border-t border-gray-100 mt-2">
                                            <button
                                                onClick={logout}
                                                className="flex items-center gap-3 px-4 py-3 w-full text-[14px] text-red-600 hover:text-red-700 hover:bg-red-50 group/logout"
                                            >
                                                <i className="fas fa-sign-out-alt w-4 text-red-400 group-hover/logout:text-red-500"></i>
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-[14px] font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-[14px] font-medium text-white bg-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 hover:shadow-md transition-all duration-200"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
