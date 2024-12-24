import React, { useState } from "react";
import {
  GanttChartIcon as ChartNoAxesGantt,
  ChevronLeft,
  MoreVertical,
  ShoppingBag,
  Store,
  Package,
  LogOut,
  Phone,
  UserCircle,
  ClipboardList,
  StoreIcon,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const initialOrders = [
  {
    id: "1",
    customerName: "Ramesh Kumar Singh",
    initials: "RK",
    timestamp: "24th Dec, 2024 5:34 PM",
    amount: 469,
    items: [
      "/images/patato.png",
      "/images/tamato.png",
      "/images/redchilli.png",
      "/images/onion.png",
    ],
    extraItems: 3,
    status: "pending",
  },
  {
    id: "2",
    customerName: "Ankita Munshi",
    initials: "AM",
    timestamp: "24th Dec, 2024 4:20 PM",
    amount: 244,
    items: ["/images/onion.png", "/images/redchilli.png", "/images/patato.png"],
    status: "pending",
  },
  {
    id: "3",
    customerName: "Akhil Ganguly",
    initials: "AG",
    timestamp: "24th Dec, 2024 4:50 PM",
    amount: 56,
    items: ["/images/onion.png"],
    status: "pending",
  },
  {
    id: "4",
    customerName: "Rajesh Bandi",
    initials: "RB",
    timestamp: "24th Dec, 2024 5:50 PM",
    amount: 167,
    items: [
      "/images/patato.png",
      "/images/redchilli.png",
      "/images/onion.png",
      "/images/tamato.png",
    ],
    status: "pending",
  },
  {
    id: "5",
    customerName: "Prabha Biren Deep",
    initials: "PB",
    timestamp: "24th Dec, 2024 6:34 PM",
    amount: 282,
    items: [
      "/images/patato.png",
      "/images/patato.png",
      "/images/patato.png",
      "/images/patato.png",
    ],
    extraItems: 1,
    status: "pending",
  },
  {
    id: "6",
    customerName: "Sanjay Mehta",
    initials: "SM",
    timestamp: "24th Dec, 2024 3:15 PM",
    amount: 350,
    items: ["/images/patato.png", "/images/patato.png", "/images/patato.png"],
    status: "completed",
    paymentStatus: "payment_due",
  },
  {
    id: "7",
    customerName: "Priya Sharma",
    initials: "PS",
    timestamp: "24th Dec, 2024 2:45 PM",
    amount: 180,
    items: ["/images/patato.png", "/images/patato.png"],
    status: "completed",
    paymentStatus: "payment_due",
  },
];

function OrderCard({ order, onPaymentDone, showPaymentButton }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={(e) => {
        // Prevent navigation when clicking the "Payment Done" button
        if (e.target.tagName !== "BUTTON") {
          navigate("/vendor/orders/id");
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <span className="text-sm font-medium">{order.initials}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{order.customerName}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span className="h-4 w-4">🕒</span>
              {order.timestamp}
            </div>
          </div>
        </div>
        <p className="font-medium text-green-600">₹ {order.amount}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden border bg-gray-50"
          >
            <img
              src={item}
              alt="Product"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {order.extraItems && (
          <div className="h-14 w-14 flex-shrink-0 rounded-lg border bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600">
            +{order.extraItems}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm font-medium">
          Status:{" "}
          <span
            className={
              order.status === "completed" &&
              order.paymentStatus === "completed"
                ? "text-green-600"
                : "text-orange-500"
            }
          >
            {order.status === "completed" && order.paymentStatus === "completed"
              ? "Completed"
              : order.status === "completed"
              ? "Payment Due"
              : "Pending"}
          </span>
        </div>
        {showPaymentButton &&
          order.status === "completed" &&
          order.paymentStatus === "payment_due" && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPaymentDone(order.id);
              }}
              variant="outline"
              size="sm"
            >
              Payment Done
            </Button>
          )}
      </div>
    </motion.div>
  );
}

export default function OrderPage() {
  const [orders, setOrders] = useState(initialOrders);
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );
  const { logout } = useAuth();

  const handlePaymentDone = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, paymentStatus: "completed" } : order
      )
    );
  };

  return (
    <div className="min-h-screen sm:border-l sm:border-r bg-gray-50 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-gray-900 ml-2">
          Orders Page
        </h1>
        <VendorMenu />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full flex flex-col">
        <TabsList className="w-full justify-start h-12 p-0 bg-white border-b rounded-none sticky top-12 z-10 flex-shrink-0">
          <TabsTrigger
            value="pending"
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none transition-colors"
          >
            Pending Orders
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none transition-colors"
          >
            Completed Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="pending"
          className="px-4 space-y-2 py-1 flex-1 overflow-y-auto"
        >
          {pendingOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPaymentDone={handlePaymentDone}
              showPaymentButton={false}
            />
          ))}
        </TabsContent>

        <TabsContent
          value="completed"
          className="px-4 py-4 space-y-4 flex-1 overflow-y-auto"
        >
          {completedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPaymentDone={handlePaymentDone}
              showPaymentButton={true}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* Bottom Navigation */}
      <TooltipProvider>
        <nav className="w-full fixed bottom-0 max-w-sm mx-auto py-2 px-4 flex items-center justify-around bg-white rounded-t-xl shadow-lg border-t z-20">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/vendor" className="p-2">
                <ShoppingBag className="h-6 w-6 text-black" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>My Orders</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/vendor/store" className="p-2">
                <Store className="h-6 w-6 text-gray-500" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>My Store</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/vendor/product/pricing" className="p-2">
                <Package className="h-6 w-6 text-gray-500" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>My Products</p>
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
    </div>
  );
}

const VendorMenu = () => {
  const { logout } = useAuth();

  return (
    <Link to="/vendor/profile" className="ml-auto mr-2">
      <UserCircle className="h-7 w-7 " />
    </Link>
  );
};
