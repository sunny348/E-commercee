const Product = require("../models/product.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Get server URL from environment or default
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only image files are allowed!"));
    },
}).single("image");

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        // Add full URL to image paths
        const productsWithFullImageUrls = products.map((product) => {
            const productObj = product.toJSON();
            if (productObj.image && !productObj.image.startsWith("http")) {
                productObj.image = `${SERVER_URL}${productObj.image}`;
            }
            return productObj;
        });

        res.status(200).json({
            success: true,
            products: productsWithFullImageUrls,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message,
        });
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const productObj = product.toJSON();
        if (productObj.image && !productObj.image.startsWith("http")) {
            productObj.image = `${SERVER_URL}${productObj.image}`;
        }

        res.status(200).json({
            success: true,
            product: productObj,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: error.message,
        });
    }
};

// Create product
exports.createProduct = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Please upload an image",
                });
            }

            const imageUrl = `/uploads/${req.file.filename}`;
            const productData = {
                ...req.body,
                image: imageUrl,
                price: parseFloat(req.body.price),
                stock: parseInt(req.body.stock),
            };

            const product = await Product.create(productData);
            const productObj = product.toJSON();
            productObj.image = `${SERVER_URL}${imageUrl}`;

            res.status(201).json({
                success: true,
                product: productObj,
            });
        } catch (error) {
            // If there's an error, remove the uploaded file
            if (req.file) {
                fs.unlinkSync(path.join(uploadDir, req.file.filename));
            }
            res.status(500).json({
                success: false,
                message: "Error creating product",
                error: error.message,
            });
        }
    });
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        await product.update(req.body);
        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating product",
            error: error.message,
        });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        await product.destroy();
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: error.message,
        });
    }
};
