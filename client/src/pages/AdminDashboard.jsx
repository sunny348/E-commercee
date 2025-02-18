import React, { useState, useEffect, useRef } from "react";
import AddProductModal from "../components/admin/AddProductModal";
import EditProductModal from "../components/admin/EditProductModal";
import ProductsTable from "../components/admin/ProductsTable";
import OrdersTable from "../components/admin/OrdersTable";
import UsersTable from "../components/admin/UsersTable";
import { toast } from "react-hot-toast";
import CustomToast from "../components/CustomToast";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("products");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stats, setStats] = useState({
        totalSales: 0,
        activeOrders: 0,
        totalUsers: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const productsTableRef = useRef(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/stats",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProduct = async (productData) => {
        try {
            const formData = new FormData();
            Object.keys(productData).forEach((key) => {
                formData.append(key, productData[key]);
            });

            const response = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                toast.custom(
                    (t) => (
                        <CustomToast
                            t={t}
                            icon={data.product.image}
                            title="Product Added"
                            message={`${productData.name} has been added successfully`}
                        />
                    ),
                    {
                        duration: 3000,
                        position: "bottom-right",
                    }
                );
                setIsAddModalOpen(false);
                if (activeTab === "products" && productsTableRef.current) {
                    productsTableRef.current.refresh();
                }
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.custom(
                (t) => (
                    <CustomToast
                        t={t}
                        iconClass="fas fa-exclamation-circle"
                        title="Error"
                        message={error.message || "Failed to add product"}
                    />
                ),
                {
                    duration: 3000,
                    position: "bottom-right",
                }
            );
        }
    };

    const handleEditProduct = async (productData) => {
        try {
            const formData = new FormData();
            Object.keys(productData).forEach((key) => {
                if (key === "image" && !productData[key]) return;
                formData.append(key, productData[key]);
            });

            const response = await fetch(
                `http://localhost:5000/api/products/${selectedProduct.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.success) {
                toast.custom(
                    (t) => (
                        <CustomToast
                            t={t}
                            icon={data.product.image}
                            title="Product Updated"
                            message={`${productData.name} has been updated successfully`}
                        />
                    ),
                    {
                        duration: 3000,
                        position: "bottom-right",
                    }
                );
                setIsEditModalOpen(false);
                setSelectedProduct(null);
                if (activeTab === "products" && productsTableRef.current) {
                    productsTableRef.current.refresh();
                }
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.custom(
                (t) => (
                    <CustomToast
                        t={t}
                        iconClass="fas fa-exclamation-circle"
                        title="Error"
                        message={error.message || "Failed to update product"}
                    />
                ),
                {
                    duration: 3000,
                    position: "bottom-right",
                }
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                        Admin Dashboard
                    </h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Add Product
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold text-gray-700">
                                Total Sales
                            </h4>
                            <i className="fas fa-chart-line text-2xl text-gray-400"></i>
                        </div>
                        <p className="text-3xl font-bold mt-2">
                            ${stats.totalSales.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            +12% from last month
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold text-gray-700">
                                Active Orders
                            </h4>
                            <i className="fas fa-shopping-bag text-2xl text-gray-400"></i>
                        </div>
                        <p className="text-3xl font-bold mt-2">
                            {stats.activeOrders}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {Math.floor(stats.activeOrders * 0.2)} pending
                            delivery
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold text-gray-700">
                                Total Users
                            </h4>
                            <i className="fas fa-users text-2xl text-gray-400"></i>
                        </div>
                        <p className="text-3xl font-bold mt-2">
                            {stats.totalUsers}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            +8 new today
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-100">
                        <nav className="flex space-x-8 px-6">
                            {["products", "orders", "users"].map((tab) => (
                                <button
                                    key={tab}
                                    className={`${
                                        activeTab === tab
                                            ? "border-gray-900 text-gray-900"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 capitalize`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === "products" && (
                            <ProductsTable
                                ref={productsTableRef}
                                onEdit={(product) => {
                                    setSelectedProduct(product);
                                    setIsEditModalOpen(true);
                                }}
                            />
                        )}
                        {activeTab === "orders" && <OrdersTable />}
                        {activeTab === "users" && <UsersTable />}
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddProduct}
            />

            {/* Edit Product Modal */}
            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedProduct(null);
                }}
                onSubmit={handleEditProduct}
                product={selectedProduct}
            />
        </div>
    );
};

export default AdminDashboard;
