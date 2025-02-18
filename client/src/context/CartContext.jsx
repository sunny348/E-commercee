import React, { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext();

// Custom hook for using cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    // Calculate total whenever cart changes
    useEffect(() => {
        const newTotal = cart.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);
        setTotal(Number(newTotal.toFixed(2)));
    }, [cart]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Add item to cart
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.id === product.id
            );
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    // Update item quantity
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
    };

    // Get cart total
    const getCartTotal = () => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    // Get cart items count
    const getCartItemsCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const value = {
        cart,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};
