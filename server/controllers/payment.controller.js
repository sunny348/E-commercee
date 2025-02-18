const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is required",
            });
        }

        console.log("Creating order with amount:", amount);

        const options = {
            amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `order_${Date.now()}`,
        };

        console.log("Order options:", options);

        const order = await razorpay.orders.create(options);
        console.log("Order created:", order);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error.message,
            details: error.stack,
        });
    }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing required payment verification parameters",
            });
        }

        console.log("Verifying payment with parameters:", {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        console.log("Generated signature:", expectedSign);
        console.log("Received signature:", razorpay_signature);

        if (razorpay_signature === expectedSign) {
            res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid signature",
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment",
            error: error.message,
            details: error.stack,
        });
    }
};
