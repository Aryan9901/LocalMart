import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import OTPPage from "./pages/OTPPage";
import Dashboard from "./pages/DashboardPage";
import ShoppingCart from "./components/elements/ShoppingCart";
import OrderHistory from "./components/elements/OrderHistory";
import PageNotFound from "./pages/PageNotFound";
import OrderPage from "./pages/vendor/OrderPage";
import ProductPricing from "./pages/vendor/ProductPricing";
import OrderDetails from "./pages/vendor/OrderDetails";

// Protected Route Component for Vendors
const VendorRoute = () => {
  const { isAuthenticated, userRole } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (userRole !== "vendor") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

// Protected Route Component for Other Users
const UserRoute = () => {
  const { isAuthenticated, userRole } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (userRole === "vendor") {
    return <Navigate to="/vendor" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <div className="max-w-sm mx-auto">
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<OTPPage />} />
            <Route path="*" element={<PageNotFound />} />

            {/* Vendor Routes */}
            <Route path="/vendor/" element={<VendorRoute />}>
              <Route index element={<OrderPage />} />
              <Route path="product/pricing" element={<ProductPricing />} />
              <Route path="order" element={<OrderDetails />} />
            </Route>

            {/* User Routes */}
            <Route path="/" element={<UserRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="cart" element={<ShoppingCart />} />
              <Route path="history" element={<OrderHistory />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
