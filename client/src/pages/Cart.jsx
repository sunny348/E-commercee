import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Checkout from "../components/Checkout";

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, total } =
        useContext(CartContext);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
            {cart.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Your cart is empty</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center p-6 border-b border-gray-100 last:border-0"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1 ml-6">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            ${item.price}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="text-gray-500 hover:text-gray-700"
                                            disabled={item.quantity <= 1}
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="mx-4 w-8 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="ml-6 text-red-500 hover:text-red-700"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                Order Summary
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>
                                    <span className="text-gray-900">
                                        ${total}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Shipping
                                    </span>
                                    <span className="text-gray-900">Free</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-medium text-gray-900">
                                            Total
                                        </span>
                                        <span className="text-lg font-medium text-gray-900">
                                            ${total}
                                        </span>
                                    </div>
                                </div>
                                <Checkout />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
