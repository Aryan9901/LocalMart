import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet, // Import Outlet
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import OTPPage from "./pages/OTPPage";
import Dashboard from "./pages/DashboardPage";
import ShoppingCart from "./components/elements/ShoppingCart";
import OrderHistory from "./components/elements/OrderHistory";

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />; // Render child routes
};

function App() {
  return (
    <AuthProvider>
      <div className="max-w-sm mx-auto">
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<OTPPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute />}>
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
