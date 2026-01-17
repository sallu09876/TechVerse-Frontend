import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import Footer from "./components/Footer";
import "animate.css";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop /> 
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
