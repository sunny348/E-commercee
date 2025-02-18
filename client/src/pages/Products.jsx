import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";
import CustomToast from '../components/CustomToast';

const Products = () => {
    const { addToCart, cart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [error, setError] = useState("");

    const categories = [
        "all",
        "electronics",
        "clothing",
        "books",
        "home",
        "sports",
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products");
            const data = await response.json();
            if (data.success) {
                setProducts(data.products);
            } else {
                setError("Failed to fetch products");
            }
        } catch (error) {
            setError("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    const getItemQuantity = (productId) => {
        const item = cart.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.custom((t) => (
            <CustomToast
                t={t}
                icon={product.image}
                title={product.name}
                message="Added to cart"
            />
        ), {
            duration: false,
            position: 'bottom-right',
            style: {
                transition: 'all 0.1s ease-out'
            },
        });
    };

    const filteredProducts = products
        .filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(
            (product) =>
                selectedCategory === "all" ||
                product.category === selectedCategory
        )
        .sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortBy === "price-low") {
                return a.price - b.price;
            } else if (sortBy === "price-high") {
                return b.price - a.price;
            }
            return 0;
        });

    if (loading || error) {
        return (
            <div className="h-full flex items-center justify-center">
                {loading ? (
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
                ) : (
                    <p className="text-sm text-gray-500">{error}</p>
                )}
            </div>
        );
    }

    return (
        <div className="h-full flex bg-white">
            {/* Filters Sidebar */}
            <div className="w-64 border-r border-gray-100 flex-shrink-0">
                <div className="p-4 space-y-6">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
                            Categories
                        </label>
                        <div className="space-y-1">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    className={`w-full px-2 py-1.5 text-sm text-left rounded ${
                                        selectedCategory === category
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
                            Sort By
                        </label>
                        <select
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-300"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="name">Name</option>
                            <option value="price-low">
                                Price: Low to High
                            </option>
                            <option value="price-high">
                                Price: High to Low
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="p-6">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white border border-gray-100 rounded-lg hover:shadow-md transition-all duration-200 flex flex-col"
                                >
                                    {/* Image Container - Fixed aspect ratio */}
                                    <div className="aspect-[4/3] relative rounded-t-lg">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        <div className="absolute top-2 right-2">
                                            <span className="px-2 py-1 text-xs bg-white/90 backdrop-blur-sm rounded-md font-medium shadow-sm">
                                                ${product.price}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Container - Fixed height and padding */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        {/* Product Info */}
                                        <div className="mb-3">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                                                    {product.name}
                                                </h3>
                                                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize flex-shrink-0">
                                                    {product.category}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2 h-8">
                                                {product.description}
                                            </p>
                                        </div>

                                        {/* Bottom Section - Fixed height */}
                                        <div className="flex items-center justify-between mt-auto pt-2">
                                            <span className="text-[10px] text-gray-500">
                                                {product.stock} available
                                            </span>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                                            >
                                                <i className="fas fa-plus text-[10px]"></i>
                                                {getItemQuantity(product.id) > 0 ? (
                                                    <>
                                                        <span>Add More</span>
                                                        <span className="ml-1 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px]">
                                                            {getItemQuantity(product.id)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    'Add to Cart'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <i className="fas fa-search text-gray-400"></i>
                                </div>
                                <p className="text-sm text-gray-500">
                                    No products found
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
