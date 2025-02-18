import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import { toast } from "react-hot-toast";
import CustomToast from "../CustomToast";

const ProductsTable = forwardRef(({ onEdit }, ref) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products");
            const data = await response.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Expose the refresh method to parent components
    useImperativeHandle(ref, () => ({
        refresh: fetchProducts,
    }));

    const handleDelete = async (productId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/products/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            const data = await response.json();

            if (data.success) {
                setProducts(products.filter((p) => p.id !== productId));
                toast.custom(
                    (t) => (
                        <CustomToast
                            t={t}
                            iconClass="fas fa-check"
                            title="Success"
                            message="Product deleted successfully"
                        />
                    ),
                    {
                        duration: 3000,
                        position: "bottom-right",
                    }
                );
            }
        } catch (error) {
            toast.custom(
                (t) => (
                    <CustomToast
                        t={t}
                        iconClass="fas fa-exclamation-circle"
                        title="Error"
                        message="Failed to delete product"
                    />
                ),
                {
                    duration: 3000,
                    position: "bottom-right",
                }
            );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                        <img
                                            className="h-10 w-10 rounded-lg object-cover"
                                            src={product.image}
                                            alt={product.name}
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.name}
                                        </div>
                                        <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                            {product.description}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                                    {product.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${product.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                                        product.stock > 10
                                            ? "bg-green-100 text-green-800"
                                            : product.stock > 0
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {product.stock} left
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    className="text-gray-400 hover:text-gray-900 mx-2"
                                    onClick={() => onEdit(product)}
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button
                                    className="text-gray-400 hover:text-red-600 mx-2"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default ProductsTable;
