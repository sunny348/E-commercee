import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <div className="h-screen flex flex-col bg-white overflow-hidden">
                        <Navbar />
                        <main className="flex-1 overflow-hidden">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/products"
                                    element={<Products />}
                                />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/register"
                                    element={<Register />}
                                />
                                <Route
                                    path="/admin"
                                    element={<AdminDashboard />}
                                />
                            </Routes>
                        </main>
                        <Toaster position="top-right" />
                    </div>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
