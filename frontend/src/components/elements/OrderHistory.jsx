import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  BadgeAlert,
  BadgeCheck,
  BadgeDollarSign,
  BadgeInfo,
  Ban,
  CalendarSync,
  History,
  IndianRupee,
  Phone,
  ShoppingCart,
  Store,
  UserCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";

const OrderHistory = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id;

      if (!userId) {
        setError("User not found. Please log in.");
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/rest/subziwale/api/v1/orders/user`,
          {
            headers: {
              "X-User-Id": userId,
            },
          }
        );
        setOrders(data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const renderNavItem = (to, icon, label) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={to} className="p-2">
          {icon}
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );

  const renderOrderStatus = (status) => {
    switch (status) {
      case "Completed":
        return (
          <div className="flex items-center gap-1 text-green-500 text-sm">
            {status}
            <BadgeCheck className="w-6 h-6 rounded-full " />
          </div>
        );
      case "Pending":
        return (
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            {status}
            <BadgeInfo className="w-6 h-6 rounded-full " />
          </div>
        );
      case "Cancelled":
        return (
          <div className="flex items-center gap-1 text-red-500 text-sm">
            {status}
            <Ban className="w-6 h-6 rounded-full " />
          </div>
        );
      case "Paid":
        return (
          <div className="flex items-center gap-1 text-blue-500 text-sm">
            {status}
            <BadgeDollarSign className="w-6 h-6 rounded-full " />
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-amber-700 text-sm">
            {status}
            <CalendarSync className="w-6 h-6 rounded-full " />
          </div>
        );
    }
  };

  const renderProductImage = (product) => (
    <div
      key={uuidv4()}
      className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100"
    >
      {product.productImageUrl ? (
        <img
          src={product.productImageUrl}
          alt={product.productName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs bg-gray-200">
          Image not found
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader"></div>
        </div>
      )}
      <div className="bg-white px-4 py-4 flex items-center border-b">
        <Link to="/">
          <img src="/images/logo.png" alt="Logo" className="w-20" />
        </Link>
        <h1 className="text-base font-medium flex-1 text-left ml-4 mr-6">
          Order History
        </h1>
        <UserMenu />
      </div>

      <div className="p-4 pb-16 max-w-sm mx-auto">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders found</div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order, index) => (
              <div
                key={uuidv4()}
                className="bg-white rounded-lg p-4 shadow-sm cursor-pointer"
                onClick={() => navigate(`/history/${order?.orderId}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-500">
                    {new Date(order?.orderDate).toLocaleString()}
                  </div>
                  {renderOrderStatus(order?.status)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {order.products.slice(0, 4).map(renderProductImage)}
                    {order.products.length > 4 && (
                      <div className="text-sm text-gray-500 ml-1">
                        +{order.products.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="font-medium">₹ {order.total}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {localStorage.getItem("userRole") === "user" && (
        <TooltipProvider>
          <nav className="w-full fixed bottom-0 max-w-sm mx-auto py-2 px-4 flex items-center justify-around bg-white rounded-t-xl shadow-lg border-t z-20">
            {renderNavItem(
              "/history",
              <History className="h-6 w-6 text-black" />,
              "My Orders"
            )}
            {renderNavItem(
              "/",
              <Store className="h-6 w-6 text-gray-500" />,
              "My Store"
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#39c55e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>cart</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Phone
                  onClick={() => {
                    const user = JSON.parse(
                      localStorage.getItem("user") || "{}"
                    );
                    if (user.contactNo) {
                      window.open(`tel:${user.contactNo}`);
                    }
                  }}
                  className="h-6 w-6 text-gray-600 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Support</p>
              </TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>
      )}
    </div>
  );
};

const UserMenu = () => {
  return (
    <Link to="/profile" className="ml-auto mr-2">
      <UserCircle className="h-7 w-7" />
    </Link>
  );
};

export default OrderHistory;
