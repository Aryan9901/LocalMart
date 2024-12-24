import React, { useState } from "react";
import {
  BadgeAlert,
  BadgeCheck,
  BadgeInfo,
  ChevronLeft,
  History,
  LogOut,
  Phone,
  ShoppingCart,
  Store,
  StoreIcon,
  User,
  UserCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../../contexts/AuthContext";

const OrderHistory = () => {
  const orders = [
    {
      id: 1,
      date: "24th Dec, 2024 5:34 PM",
      items: [
        "/images/patato.png",
        "/images/onion.png",
        "/images/tamato.png",
        "/images/redchilli.png",
      ],
      extraItems: 3,
      total: 269,
      status: "pending",
    },
    {
      id: 2,
      date: "12th Dec, 2024 3:04 PM",
      items: [
        "/images/patato.png",
        "/images/onion.png",
        "/images/patato.png",
        "/images/redchilli.png",
      ],
      total: 144,
      status: "completed",
    },
    {
      id: 3,
      date: "9th Dec, 2024 5:19 PM",
      items: [
        "/images/onion.png",
        "/images/redchilli.png",
        "/images/tamato.png",
      ],
      total: 206,
      status: "completed",
    },
    {
      id: 4,
      date: "30th Nov, 2024 6:24 PM",
      items: ["/images/tamato.png", "/images/onion.png"],
      total: 249,
      status: "completed",
    },
    {
      id: 5,
      date: "19th Nov, 2024 5:28 PM",
      items: [
        "/images/tamato.png",
        "/images/redchilli.png",
        "/images/onion.png",
        "/images/tamato.png",
      ],
      extraItems: 2,
      total: 215,
      status: "cancelled",
    },
  ];
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4  flex items-center border-b">
        <h1 className="text-lg font-medium flex-1 text-left ml-4 mr-6">
          Order History
        </h1>
        <UserMenu />
      </div>

      {/* Order List */}
      <div className="p-4 pb-16 max-w-sm mx-auto">
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg p-4 shadow-sm cursor-pointer"
              onClick={() => navigate(`/history/${order.id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500">{order.date}</div>
                {order.status === "completed" ? (
                  <BadgeCheck className="w-6 h-6 rounded-full text-green-500" />
                ) : order?.status === "pending" ? (
                  <BadgeInfo className="w-6 h-6 rounded-full text-yellow-500" />
                ) : (
                  <BadgeAlert className="w-6 h-6 rounded-full text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={item}
                        alt={`Order item ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {order.extraItems && (
                    <div className="text-sm text-gray-500 ml-1">
                      +{order.extraItems}
                    </div>
                  )}
                </div>
                <div className="font-medium">₹ {order.total}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* bottom nav */}
      {userRole === "user" && (
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
                <Phone className="h-6 w-6 text-gray-600 cursor-pointer" />
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

export default OrderHistory;

const UserMenu = () => {
  const { logout } = useAuth();

  return (
    <Link to="/profile" className="ml-auto mr-2">
      <UserCircle className="h-7 w-7 " />
    </Link>
  );
};
