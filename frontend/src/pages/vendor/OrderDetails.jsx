"use client";

import { useState } from "react";
import {
  ChevronLeft,
  History,
  HistoryIcon,
  LogOut,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  ShoppingCart,
  Store,
  StoreIcon,
  User,
  UserCircle,
  X,
  Plus,
  Minus,
  PlusCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isBefore, isAfter } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const timeSlots = [
  "08:00-10:00",
  "10:00-12:00",
  "12:00-14:00",
  "14:00-16:00",
  "16:00-18:00",
  "18:00-20:00",
];

const formatTimeSlot = (slot) => {
  const [start, end] = slot.split("-");
  return `${formatTime(start)} - ${formatTime(end)}`;
};

const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const date = new Date(0, 0, 0, hours, minutes);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

export default function OrderDetails() {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [orderItems, setOrderItems] = useState([
    {
      name: "Potato (Aloo)",
      quantity: 1,
      price: 39,
      image: "/images/patato.png",
    },
    {
      name: "Chilli (Mirchi)",
      quantity: 1,
      price: 19,
      image: "/images/onion.png",
    },
    {
      name: "Tomato (Tamatar)",
      quantity: 1,
      price: 29,
      image: "/images/redchilli.png",
    },
    {
      name: "Mushroom",
      quantity: 1,
      price: 34,
      image: "/images/tamato.png",
    },
  ]);

  const handleQuantityChange = (index, change) => {
    const newOrderItems = [...orderItems];
    newOrderItems[index].quantity = Math.max(
      0,
      newOrderItems[index].quantity + change
    );
    setOrderItems(newOrderItems);
  };

  const handleAddNewItem = () => {
    // This function would open a modal or navigate to a page to add a new item
    console.log("Add new item");
  };

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

  const orderSummary = {
    mrpTotal: orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
    discount: 30,
    platformFees: 10,
    deliveryCharges: 0,
    get total() {
      return (
        this.mrpTotal - this.discount + this.platformFees + this.deliveryCharges
      );
    },
  };

  const orderStatus = "Pending"; // This could be 'Pending', 'Delivered', or 'Cancelled'
  const orderDate = new Date("2024-12-25T14:00:00"); // Example date
  const timeSlot = "14:00-16:00";
  const currentTime = new Date();
  const slotStartTime = new Date(orderDate);
  slotStartTime.setHours(14, 0, 0, 0);
  const canRequestCancellation =
    currentTime.getTime() < slotStartTime.getTime() - 3600000; // 1 hour before slot start time
  const canReschedule = currentTime.getTime() < slotStartTime.getTime(); // Before slot start time

  const cancelReasons =
    userRole === "vendor"
      ? [
          "Incorrect address",
          "Customer not responding",
          "Denied delivery",
          "Unavailable",
          "Other",
        ]
      : [
          "Out of Home",
          "Found a better price elsewhere",
          "Ordered by mistake",
          "Delivery time is too long",
          "Other",
        ];

  const handleCancelOrder = () => {
    // Implement cancellation logic here
    console.log(
      `Order ${
        userRole === "vendor" ? "cancelled" : "cancellation requested"
      } with reason:`,
      cancelReason
    );
    setIsCancelModalOpen(false);
  };

  const handleRescheduleOrder = () => {
    // Implement rescheduling logic here
    console.log(
      `Order ${
        userRole === "vendor" ? "rescheduled" : "reschedule requested"
      } to:`,
      format(rescheduleDate, "PPP"),
      "Time slot:",
      formatTimeSlot(selectedTimeSlot)
    );
    setIsRescheduleModalOpen(false);
  };

  const handleMarkDelivered = () => {
    // Implement mark as delivered logic here
    console.log("Order marked as delivered");
  };

  const handleBuyAgain = () => {
    // Implement buy again logic here
    console.log("Buy Again clicked for order items:", orderItems);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-6 w-6 cursor-pointer" />
          </Button>
          <h1 className="text-lg font-medium">Order Details</h1>
          <UserMenu />
        </div>
      </header>

      <main className="mx-auto mb-16 max-w-lg space-y-4 p-4">
        <section className="rounded-lg bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium">Order Items</h2>
            {userRole === "vendor" && (
              <Button variant="outline" size="sm" onClick={handleAddNewItem}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 ${
                  item.quantity === 0 ? "opacity-50" : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-md w-16"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">
                    ₹ {item.price} per unit
                  </p>
                </div>
                {userRole === "vendor" && (
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      className="h-7 w-7 px-2 border-none"
                      onClick={() => handleQuantityChange(index, -1)}
                      disabled={item.quantity === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="outline"
                      className="h-7 w-7 px-2 border-none"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <p className="font-medium text-sm">
                  {item.quantity === 0
                    ? "0"
                    : `₹ ${item.price * item.quantity}`}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-white p-4">
          <h2 className="mb-4 font-medium">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">MRP Total</span>
              <span>₹ {orderSummary.mrpTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600">
                - ₹ {orderSummary.discount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fees</span>
              <span>- ₹ {orderSummary.platformFees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charges</span>
              <span>₹ {orderSummary.deliveryCharges}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-medium">
              <span>TOTAL</span>
              <span>₹ {orderSummary.total}</span>
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-white p-4">
          <h2 className="mb-4 font-medium">Delivery Details</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-gray-500" />
              <p className="text-sm text-gray-600">
                125B, Gali No. 14, Agarkhar, Jamnipal, Kotba, Chhattisgarh,
                495450
              </p>
            </div>
            <div className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-gray-500" />
              <p className="text-sm text-gray-600">+91 9845134576</p>
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-white p-4">
          <h2 className="mb-4 font-medium">Order Status</h2>
          <p className="text-sm text-gray-600">
            Status: <span className="font-medium">{orderStatus}</span>
          </p>
          <p className="text-sm text-gray-600">
            Date:{" "}
            <span className="font-medium">{format(orderDate, "PPP")}</span>
          </p>
          <p className="text-sm text-gray-600">
            Time Slot:{" "}
            <span className="font-medium">{formatTimeSlot(timeSlot)}</span>
          </p>
        </section>

        {userRole === "vendor" ? (
          <footer className="bg-white p-4">
            <div className="mx-auto flex max-w-lg gap-2 items-center justify-between">
              <Button
                className="bg-red-600 w-1/3 hover:bg-red-500"
                onClick={() => setIsCancelModalOpen(true)}
              >
                Cancel Order
              </Button>
              <Button
                className="bg-blue-600 w-1/3 hover:bg-blue-700"
                onClick={() => setIsRescheduleModalOpen(true)}
              >
                Reschedule
              </Button>
              <Button
                className="bg-green-600 w-1/3 hover:bg-green-700"
                onClick={handleMarkDelivered}
              >
                Mark Delivered
              </Button>
            </div>
          </footer>
        ) : (
          <footer className="bg-white p-4">
            <div className="mx-auto flex max-w-lg gap-2 items-center justify-between">
              {canRequestCancellation && orderStatus === "Pending" && (
                <Button
                  className="bg-red-600 w-1/3 hover:bg-red-500"
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  Cancel Order
                </Button>
              )}
              {canReschedule && orderStatus === "Pending" && (
                <Button
                  className="bg-blue-600 w-1/3 hover:bg-blue-700"
                  onClick={() => setIsRescheduleModalOpen(true)}
                >
                  Reschedule
                </Button>
              )}
              <Button
                className="bg-green-600 w-1/3 hover:bg-green-700"
                onClick={handleBuyAgain}
              >
                Buy Again
              </Button>
            </div>
            {!canRequestCancellation &&
              !canReschedule &&
              orderStatus === "Pending" && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  Cancellation and rescheduling are no longer available for this
                  order.
                </p>
              )}
          </footer>
        )}
      </main>

      {isCancelModalOpen && (
        <div className="fixed inset-0 max-w-sm mx-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                {userRole === "vendor" ? "Cancel Order" : "Cancel Order"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCancelModalOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Please select a reason for cancelling this order:
            </p>
            <RadioGroup onValueChange={setCancelReason} className="space-y-2">
              {cancelReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="cursor-pointer">
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsCancelModalOpen(false)}
                className="mr-2"
              >
                Close
              </Button>
              <Button onClick={handleCancelOrder}>Cancel Order</Button>
            </div>
          </div>
        </div>
      )}

      {isRescheduleModalOpen && (
        <div className="fixed inset-0 z-50 max-w-sm mx-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Reschedule Order</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRescheduleModalOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Please select a new date for your order:
            </p>
            <Calendar
              mode="single"
              selected={rescheduleDate}
              onSelect={(date) => date && setRescheduleDate(date)}
              disabled={(date) => isBefore(date, new Date())}
              className="rounded-md border"
            />
            <div className="mt-4">
              <label
                htmlFor="timeSlot"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Time Slot
              </label>
              <Select
                onValueChange={setSelectedTimeSlot}
                value={selectedTimeSlot}
              >
                <SelectTrigger id="timeSlot">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {formatTimeSlot(slot)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsRescheduleModalOpen(false)}
                className="mr-2"
              >
                Close
              </Button>
              <Button
                onClick={handleRescheduleOrder}
                disabled={!selectedTimeSlot}
              >
                Reschedule
              </Button>
            </div>
          </div>
        </div>
      )}
      {userRole === "vendor" && (
        <TooltipProvider>
          <nav className="w-full fixed bottom-0 max-w-sm mx-auto py-2 px-4 flex items-center justify-around bg-white rounded-t-xl shadow-lg border-t z-20">
            {renderNavItem(
              "/vendor",
              <ShoppingBag className="h-6 w-6 text-gray-500" />,
              "My Orders"
            )}
            {renderNavItem(
              "/vendor/store",
              <Store className="h-6 w-6 text-black" />,
              "My Store"
            )}
            {renderNavItem(
              "/vendor/product/pricing",
              <Package className="h-6 w-6 text-gray-500" />,
              "My Products"
            )}

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
}

const UserMenu = () => {
  const { userRole } = useAuth();

  return (
    <div className="ml-auto flex items-center justify-center mr-2">
      <Link
        to={userRole === "vendor" ? "/vendor/profile" : "/profile"}
        className="ml-auto mr-2"
      >
        <UserCircle className="h-7 w-7 " />
      </Link>
    </div>
  );
};
