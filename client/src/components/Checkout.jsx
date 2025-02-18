import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-hot-toast";
import CustomToast from "./CustomToast";

// Replace this with your Razorpay test key ID
const RAZORPAY_KEY_ID = "rzp_test_YOUR_KEY_ID";

const Checkout = () => {
    const { cart, total, clearCart } = useContext(CartContext);

    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        try {
            // Validate cart and total
            if (cart.length === 0) {
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        iconClass="fas fa-exclamation-circle"
                        title="Error"
                        message="Your cart is empty"
                    />
                ));
                return;
            }

            if (!total || total <= 0) {
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        iconClass="fas fa-exclamation-circle"
                        title="Error"
                        message="Invalid order amount"
                    />
                ));
                return;
            }

            const res = await initializeRazorpay();

            if (!res) {
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        iconClass="fas fa-exclamation-circle"
                        title="Error"
                        message="Razorpay SDK failed to load"
                    />
                ));
                return;
            }

            console.log("Creating order with amount:", total);

            // Create order
            const response = await fetch(
                "http://localhost:5000/api/payment/create-order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: total,
                    }),
                }
            );

            const data = await response.json();
            console.log("Order creation response:", data);

            if (!data.success) {
                throw new Error(data.message || "Failed to create order");
            }

            const options = {
                key: RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "E-commerce Store",
                description: `Payment for ${cart.length} items`,
                order_id: data.order.id,
                handler: async function (response) {
                    try {
                        console.log("Payment success response:", response);
                        const verifyResponse = await fetch(
                            "http://localhost:5000/api/payment/verify-payment",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    razorpay_order_id:
                                        response.razorpay_order_id,
                                    razorpay_payment_id:
                                        response.razorpay_payment_id,
                                    razorpay_signature:
                                        response.razorpay_signature,
                                }),
                            }
                        );

                        const verifyData = await verifyResponse.json();
                        console.log(
                            "Payment verification response:",
                            verifyData
                        );

                        if (verifyData.success) {
                            clearCart();
                            toast.custom((t) => (
                                <CustomToast
                                    t={t}
                                    iconClass="fas fa-check"
                                    title="Success"
                                    message="Payment successful! Order placed."
                                />
                            ));
                        } else {
                            throw new Error(
                                verifyData.message ||
                                    "Payment verification failed"
                            );
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        toast.custom((t) => (
                            <CustomToast
                                t={t}
                                iconClass="fas fa-exclamation-circle"
                                title="Error"
                                message={
                                    error.message ||
                                    "Payment verification failed"
                                }
                            />
                        ));
                    }
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: "",
                },
                theme: {
                    color: "#111827",
                },
                modal: {
                    ondismiss: function () {
                        toast.custom((t) => (
                            <CustomToast
                                t={t}
                                iconClass="fas fa-info-circle"
                                title="Info"
                                message="Payment cancelled"
                            />
                        ));
                    },
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment error:", error);
            toast.custom((t) => (
                <CustomToast
                    t={t}
                    iconClass="fas fa-exclamation-circle"
                    title="Error"
                    message={error.message || "Something went wrong"}
                />
            ));
        }
    };

    return (
        <div className="mt-6">
            <button
                onClick={handlePayment}
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                disabled={cart.length === 0 || !total || total <= 0}
            >
                <i className="fas fa-credit-card mr-2"></i>
                {cart.length === 0 ? "Cart is Empty" : `Pay ₹${total}`}
            </button>
        </div>
    );
};

export default Checkout;
