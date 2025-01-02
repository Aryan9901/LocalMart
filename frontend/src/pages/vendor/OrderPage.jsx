import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Store,
  Package,
  Phone,
  UserCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { generateToken, messaging } from "../../notifications/firebase";
import { onMessage } from "firebase/messaging";
import axios from "axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const VendorMenu = () => {
  const { logout } = useAuth();

  return (
    <Link to="/vendor/profile" className="ml-auto mr-2">
      <UserCircle className="h-7 w-7 " />
    </Link>
  );
};

function OrderCard({ order, onPaymentDone }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-500";
      case "Rescheduled":
        return "text-blue-500";
      case "Cancelled":
        return "text-red-500";
      case "Completed":
        return "text-green-500";
      case "Paid":
        return "text-green-600";
      case "PaymentPending":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={(e) => {
        if (e.target.tagName !== "BUTTON") {
          navigate(`/vendor/orders/${order.orderId}`);
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <span className="text-sm font-medium">
              {order.customerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{order.customerName}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span className="h-4 w-4">🕒</span>
              {new Date(order.orderDate).toLocaleString()}
            </div>
          </div>
        </div>
        <p className="font-medium text-green-600">₹ {order.total}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
        {order.products.slice(0, 4).map((product, index) => (
          <div
            key={index}
            className="h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden border bg-gray-50"
          >
            <img
              src={product.productImageUrl}
              alt={product.productName}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {order.products.length > 4 && (
          <div className="h-14 w-14 flex-shrink-0 rounded-lg border bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600">
            +{order.products.length - 4}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm font-medium">
          Status:{" "}
          <span className={getStatusColor(order.status)}>{order.status}</span>
        </div>
        {order.status === "PaymentPending" && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onPaymentDone(order.orderId);
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();

  const handlePaymentDone = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.orderId === orderId ? { ...order, status: "Paid" } : order
      )
    );
  };

  function playNotificationSound(notificationText) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(notificationText);
    synth.speak(utterance);
  }

  const checkNotification = () => {
    onMessage(messaging, (payload) => {
      console.log(payload.notification.title + " " + payload.notification.body);
      const voiceMessage = `${payload.notification.title} ${payload.notification.body}`;
      playNotificationSound(voiceMessage);
    });
  };

  const fetchOrders = async (status) => {
    setLoading(true);
    setError(null);
    try {
      const vendor = JSON.parse(localStorage.getItem("user"));
      const vendorId = vendor.id;
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/rest/subziwale/api/v1/orders/vendor?status=${status}&Integer=0`,
        {
          headers: {
            "X-Vendor-Id": vendorId,
          },
        }
      );
      setOrders(data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderOrders = () => {
    if (loading) {
      return <div className="loader"></div>;
    } else if (error) {
      return <div className="text-center text-red-500 py-4">{error}</div>;
    } else if (orders.length === 0) {
      return (
        <div className="text-center text-gray-500 py-4">No orders found.</div>
      );
    } else {
      return orders
        .slice()
        .reverse()
        .map((order) => (
          <OrderCard
            key={order.orderId}
            order={order}
            onPaymentDone={handlePaymentDone}
          />
        ));
    }
  };

  useEffect(() => {
    generateToken();
    checkNotification();
    const controller = new AbortController();
    fetchOrders("Pending");
    // return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen sm:border-l sm:border-r bg-gray-50 pb-20">
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-gray-900 ml-2">
          Orders Page
        </h1>
        <VendorMenu />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          fetchOrders(value);
        }}
        className="w-full flex flex-col"
      >
        <TabsList className="w-full justify-start h-12 p-0 bg-white border-b rounded-none sticky top-12 z-10 flex-shrink-0">
          <TabsTrigger
            value="Pending"
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none transition-colors"
          >
            Pending Orders
          </TabsTrigger>
          <TabsTrigger
            value="Completed"
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none transition-colors"
          >
            Completed Orders
          </TabsTrigger>
        </TabsList>

        <div className="px-4 py-2">
          <Select
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              fetchOrders(value);
            }}
          >
            <SelectTrigger className="w-44 ml-auto focus-visible:ring-offset-0 focus-visible:ring-1">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="Pending">
                Pending
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Rescheduled">
                Rescheduled
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Cancelled">
                Cancelled
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Completed">
                Completed
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Paid">
                Paid
              </SelectItem>
              <SelectItem className="cursor-pointer" value="PaymentPending">
                Payment Pending
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="px-4 space-y-2 py-0 flex-1 overflow-y-auto">
          {renderOrders()}
        </div>
      </Tabs>

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
              <Phone
                onClick={() => {
                  window.open(`tel:+919899784200}`);
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
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
