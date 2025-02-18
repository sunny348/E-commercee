import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="h-full overflow-y-auto">
            {/* Hero Section - Reduced height and padding */}
            <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-2xl text-center">
                    <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
                        Shop with confidence
                    </h1>
                    <p className="text-gray-600 mb-6 text-lg">
                        Discover our curated collection of premium products.
                        Quality meets affordability.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center text-sm font-medium text-white bg-gray-900 px-8 py-4 rounded-md hover:bg-gray-800 transition-all duration-200"
                    >
                        Browse Collection
                    </Link>
                </div>
            </div>

            {/* Categories - Reduced padding */}
            <div className="py-12 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                        Shop by Category
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                to={`/products?category=${category.id}`}
                                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100"
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-xl font-medium text-white">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features - Reduced padding */}
            <div className="py-12 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                        Why Choose Us
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {features.map((feature) => (
                            <div key={feature.title} className="text-center">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-900 text-white flex items-center justify-center">
                                    <i className={`${feature.icon}`} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Newsletter - Reduced padding */}
            <div className="py-12 px-4 bg-white">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Stay Updated
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Subscribe to get updates about new products and special
                        offers
                    </p>
                    <form className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-all duration-200"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const categories = [
    {
        id: "electronics",
        name: "Electronics",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3",
    },
    {
        id: "fashion",
        name: "Fashion",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3",
    },
    {
        id: "home",
        name: "Home & Living",
        image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-4.0.3",
    },
];

const features = [
    {
        icon: "fas fa-shipping-fast",
        title: "Fast Delivery",
        description: "Free shipping on orders over $50",
    },
    {
        icon: "fas fa-shield-alt",
        title: "Secure Payment",
        description: "100% secure payment",
    },
    {
        icon: "fas fa-headset",
        title: "24/7 Support",
        description: "Dedicated support anytime",
    },
];

export default Home;
