import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import ShoppingCart from "./components/elements/ShoppingCart";
import OrderHistory from "./components/elements/OrderHistory";
import PageNotFound from "./pages/PageNotFound";
import OrderPage from "./pages/vendor/OrderPage";
import ProductPricing from "./pages/vendor/ProductPricing";
import OrderDetails from "./pages/vendor/OrderDetails";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import SearchPage from "./components/elements/SearchPage";
import Profile from "./pages/Profile";
import AddProduct from "./components/elements/AddProduct";

// Protected Route Component for Vendors
const VendorRoute = () => {
  if (!localStorage.getItem("isAuthenticated")) {
    return <Navigate to="/login" replace />;
  }
  if (localStorage.getItem("userRole") !== "vendor") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

// Protected Route Component for Other Users
const UserRoute = () => {
  if (!localStorage.getItem("isAuthenticated")) {
    return <Navigate to="/login" replace />;
  }
  if (localStorage.getItem("userRole") === "vendor") {
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
            <Route path="*" element={<PageNotFound />} />

            {/* Vendor Routes */}
            <Route path="/vendor/" element={<VendorRoute />}>
              <Route index element={<OrderPage />} />
              <Route path="store" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="store/search" element={<SearchPage />} />
              <Route path="product/pricing" element={<ProductPricing />} />
              <Route path="orders/add/new" element={<AddProduct />} />
              <Route path="orders/:id" element={<OrderDetails />} />
            </Route>

            {/* User Routes */}
            <Route path="/" element={<UserRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="cart" element={<ShoppingCart />} />
              <Route path="history" element={<OrderHistory />} />
              <Route path="history/:id" element={<OrderDetails />} />
            </Route>
          </Routes>
        </Router>
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    </AuthProvider>
  );
}

export default App;
