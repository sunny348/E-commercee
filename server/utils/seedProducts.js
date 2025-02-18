const Product = require("../models/product.model");

const sampleProducts = [
    {
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        category: "electronics",
        stock: 50,
    },
    {
        name: "Smart Watch",
        description: "Feature-rich smartwatch with health tracking",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        category: "electronics",
        stock: 30,
    },
    {
        name: "Running Shoes",
        description: "Comfortable running shoes for professional athletes",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        category: "sports",
        stock: 100,
    },
    // Add more sample products as needed
];

const seedProducts = async () => {
    try {
        // Check if products already exist
        const existingProducts = await Product.findAll();
        if (existingProducts.length > 0) {
            console.log("Products table already has data, skipping seed");
            return;
        }

        // Only seed if no products exist
        await Product.bulkCreate(sampleProducts);
        console.log("Products seeded successfully");
    } catch (error) {
        console.error("Error seeding products:", error);
    }
};

module.exports = seedProducts;
