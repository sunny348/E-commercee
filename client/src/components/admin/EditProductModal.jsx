import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import CustomToast from "../CustomToast";

const EditProductModal = ({ isOpen, onClose, onSubmit, product }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                stock: product.stock,
                image: null,
            });
            setImagePreview(product.image);
        }
    }, [product]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            setImagePreview(null);
            const fileInput = document.getElementById("edit-file-upload");
            if (fileInput) fileInput.value = "";
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-5xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                        Edit Product
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex">
                    {/* Left side - Image Upload */}
                    <div className="w-2/5 p-6 border-r border-gray-100">
                        {imagePreview ? (
                            <div className="aspect-square relative bg-gray-50 rounded flex items-center justify-center">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-full max-w-full object-contain p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(product.image);
                                        setFormData({
                                            ...formData,
                                            image: null,
                                        });
                                        const fileInput =
                                            document.getElementById(
                                                "edit-file-upload"
                                            );
                                        if (fileInput) fileInput.value = "";
                                    }}
                                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-gray-500 hover:text-gray-700"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="edit-file-upload"
                                className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                            >
                                <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
                                <p className="text-sm text-gray-500">
                                    Click to upload image
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                                <input
                                    id="edit-file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>

                    {/* Right side - Form */}
                    <div className="w-3/5 p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter product name"
                                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    required
                                    placeholder="Enter product description"
                                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                                        value={formData.stock}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                stock: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Select category</option>
                                    <option value="electronics">
                                        Electronics
                                    </option>
                                    <option value="clothing">Clothing</option>
                                    <option value="books">Books</option>
                                    <option value="home">Home</option>
                                    <option value="sports">Sports</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
