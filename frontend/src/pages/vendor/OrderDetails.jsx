"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  History,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  ShoppingCart,
  Store,
  UserCircle,
  X,
  Plus,
  Minus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore } from "date-fns";
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
import axios from "axios";

const timeSlots = [
  "08:00-10:00",
  "10:00-12:00",
  "12:00-14:00",
  "14:00-16:00",
  "16:00-18:00",
  "18:00-20:00",
];

const formatTimeSlot = (slot) => {
  const [start, end] = slot?.split("-");
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
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [editedItems, setEditedItems] = useState([]);
  const [newItem, setNewItem] = useState({
    productName: "",
    quantity: 0,
    unit: "",
    netPrice: 0,
  });

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

  const fetchOrderDetails = async () => {
    const { id } = params;

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/rest/subziwale/api/v1/order/details?orderId=${id}`
      );
      console.log(data);

      setOrder(data);
      setEditedItems(data.items.map((item) => ({ ...item, edited: false })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [params]);

  const currentTime = new Date();
  const orderDate = order ? new Date(order.deliveryDate) : null;
  const [startTime] = order?.timeSlot ? order.timeSlot.split("-") : [];
  const slotStartTime = orderDate
    ? new Date(
        orderDate.setHours(
          parseInt(startTime?.split(":")[0]),
          parseInt(startTime?.split(":")[1]),
          0,
          0
        )
      )
    : null;

  const canRequestCancellation =
    slotStartTime && currentTime < new Date(slotStartTime.getTime() - 3600000);
  const canReschedule = slotStartTime && currentTime < slotStartTime;

  const cancelReasons =
    localStorage.getItem("userRole") === "vendor"
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

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/rest/subziwale/api/v1/order/status?orderId=${
          params?.id
        }&status=Cancelled`,
        {
          cancellationReason: cancelReason,
        }
      );
      fetchOrderDetails();
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setLoading(false);
      setIsCancelModalOpen(false);
    }
  };

  const handleRescheduleOrder = async () => {
    try {
      setLoading(true);
      console.log({
        orderId: order.orderId,
        newDate: format(rescheduleDate, "yyyy-MM-dd"),
        newTimeSlot: selectedTimeSlot,
      });

      await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/rest/subziwale/api/v1/order/status?orderId=${
          params?.id
        }&status=Rescheduled`,
        {
          cancellationReason: cancelReason,
          rescheduleDeliveryDate: format(rescheduleDate, "yyyy-MM-dd"),
          rescheduleTimeSlot: selectedTimeSlot,
        }
      );

      fetchOrderDetails();
    } catch (error) {
      console.error("Error rescheduling order:", error);
    } finally {
      setLoading(false);
      setIsRescheduleModalOpen(false);
    }
  };

  const handleMarkDelivered = async (status) => {
    console.log(status);

    try {
      setLoading(true);
      await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/rest/subziwale/api/v1/order/status?orderId=${
          params?.id
        }&status=${status}`,
        {}
      );

      fetchOrderDetails();
    } catch (error) {
      console.error("Error marking order as delivered:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyAgain = () => {
    console.log("Buy Again clicked for order items:", order.items);
  };

  const handleQuantityChange = (index, change) => {
    const newItems = editedItems.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          quantity: Math.max(0, item.quantity + change),
          edited: true,
        };
      }
      return { ...item, edited: true };
    });
    setEditedItems(newItems);
  };

  const handleAddNewItem = () => {
    // setEditedItems(
    //   editedItems
    //     .map((item) => ({ ...item, edited: true }))
    //     .concat({ ...newItem, edited: true })
    // );
    // setNewItem({ productName: "", quantity: 0, unit: "", netPrice: 0 });

    navigate("/vendor/orders/add/new");
  };

  const handleSubmitChanges = async () => {
    try {
      setLoading(true);
      // Log all items, regardless of whether they've been edited
      console.log("All items:", editedItems);
      console.log("Order details:", order);

      const updatedOrderData = {
        ...order,
        items: editedItems,
        note: order?.note || "hii",
      };

      console.log("updated order", updatedOrderData);

      const changedItems = editedItems.filter((item) => item.edited);
      if (changedItems.length > 0) {
        const { data } = await axios.put(
          `${
            import.meta.env.VITE_API_URL
          }/rest/subziwale/api/v1/order?orderId=${params?.id}`,
          updatedOrderData
        );
        fetchOrderDetails();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setLoading(false);
    }
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
      {loading && (
        <div className="inset-0  flex items-center justify-center z-50">
          <div className="loader"></div>
        </div>
      )}

      {!loading && (
        <main className="mx-auto mb-16 max-w-lg space-y-4 p-4">
          {order && (
            <>
              <section className="rounded-lg bg-white p-4">
                <h2 className="mb-4 flex items-center justify-between font-medium">
                  Order Items{" "}
                  {localStorage.getItem("userRole") === "vendor" && (
                    <Button
                      onClick={handleAddNewItem}
                      className="text-black bg-white border border-black py-0 px-3 text-sm leading-4"
                    >
                      Add Item
                    </Button>
                  )}
                </h2>
                <div className="space-y-4">
                  {editedItems.map((item, index) => (
                    <div
                      key={item.inventoryId + "-" + index}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="rounded-md w-16 h-16 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.svg?height=64&width=64";
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">
                          {item.productName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ₹ {item.netPrice} per {item.unit}
                        </p>
                      </div>
                      {localStorage.getItem("userRole") === "vendor" && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(index, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(index, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {item.quantity} {item.unit}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₹ {item.netPrice * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {localStorage.getItem("userRole") === "vendor" && (
                  <div className="mt-4 space-y-2">
                    {editedItems.some((item) => item.edited) && (
                      <Button
                        onClick={handleSubmitChanges}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Save Changes
                      </Button>
                    )}
                  </div>
                )}
              </section>

              <section className="rounded-lg bg-white p-4">
                <h2 className="mb-4 font-medium">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">MRP Total</span>
                    <span>₹ {order.mrp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">- ₹ {order.discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fees</span>
                    <span>₹ {order.platformFees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span>₹ {order.deliveryCharges}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-medium">
                    <span>TOTAL</span>
                    <span>₹ {order.total}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-lg bg-white p-4">
                <h2 className="mb-4 font-medium">Delivery Details</h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 shrink-0 text-gray-500" />
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="h-5 w-5 shrink-0 text-gray-500" />
                    <p className="text-sm text-gray-600">{order.contactNo}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-lg bg-white p-4">
                <h2 className="mb-4 font-medium">Order Status</h2>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-medium text-${
                      order.status === "Completed" ? "green" : "blue"
                    }-500`}
                  >
                    {order.status}
                  </span>
                  <span className="ml-2 text-red-600">
                    {order?.status === "Completed" && "(Payment Due)"}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Date:{" "}
                  <span className="font-medium">
                    {format(new Date(order.deliveryDate), "PPP")}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Time Slot:{" "}
                  <span className="font-medium">
                    {!order?.expressDelivery
                      ? order?.timeSlot
                        ? formatTimeSlot(order?.timeSlot)
                        : "Not Given"
                      : "Express Delivery"}
                  </span>
                </p>
              </section>
            </>
          )}

          {localStorage.getItem("userRole") === "vendor" ? (
            <footer
              className={`bg-white p-4 ${
                order?.status === "Paid" ||
                (order?.status === "Cancelled" && "hidden")
              }`}
            >
              {!order?.expressDelivery && order?.status === "Pending" ? (
                <div className="mx-auto flex max-w-lg gap-2 items-center justify-between">
                  <Button
                    className="bg-red-600 py-1 leading-5 px-4 rounded-md w-1/3 hover:bg-red-500"
                    onClick={() => setIsCancelModalOpen(true)}
                    disabled={
                      !canRequestCancellation || order?.status !== "Pending"
                    }
                  >
                    Cancel Order
                  </Button>
                  <Button
                    className="bg-blue-600 py-1 leading-5 px-4 rounded-md w-1/3 hover:bg-blue-700"
                    onClick={() => setIsRescheduleModalOpen(true)}
                    disabled={!canReschedule || order?.status !== "Pending"}
                  >
                    Reschedule
                  </Button>
                  {order?.status !== "Completed" && (
                    <Button
                      className="bg-green-600 py-1 leading-5 px-4 rounded-md w-1/3 hover:bg-green-700 text-white"
                      onClick={() => handleMarkDelivered("Completed")}
                      disabled={order?.status === "Completed"}
                    >
                      Mark Delivered
                    </Button>
                  )}
                </div>
              ) : (
                <div className={`flex items-center gap-3`}>
                  <h4
                    className={` text-balance  text-red-400 ${
                      order?.status !== "Completed"
                        ? "text-left text-sm"
                        : "text-center text-base hidden"
                    }`}
                  >
                    Express Order Can't be Rescheduled or Cancelled
                  </h4>

                  {order?.status != "Paid" && (
                    <>
                      {order?.status !== "Completed" ? (
                        <Button
                          className="bg-green-600 py-1 leading-5 px-4 rounded-md w-1/3 text-white hover:bg-green-700"
                          onClick={() => handleMarkDelivered("Completed")}
                          disabled={order?.status === "Completed"}
                        >
                          Mark Delivered
                        </Button>
                      ) : (
                        <Button
                          className="bg-blue-500 hover:bg-blue-500 py-2 leading-4 px-4 rounded-md  w-1/3 text-wrap text-white"
                          onClick={() => handleMarkDelivered("Paid")}
                        >
                          Complete Payment
                        </Button>
                      )}
                    </>
                  )}
                </div>
              )}
            </footer>
          ) : (
            <footer
              className={`bg-white p-4 ${order?.status === "Paid" && "hidden"}`}
            >
              <div className="">
                {order?.expressDelivery ? (
                  <div>
                    <Button
                      className="bg-green-600 w-1/3 hover:bg-green-700"
                      onClick={handleBuyAgain}
                    >
                      Buy Again
                    </Button>
                  </div>
                ) : (
                  <div className="w-full gap-2 flex items-center justify-center">
                    {canRequestCancellation && order?.status === "Pending" && (
                      <Button
                        className="bg-red-600 w-1/3 hover:bg-red-500"
                        onClick={() => setIsCancelModalOpen(true)}
                      >
                        Cancel Order
                      </Button>
                    )}
                    {canReschedule && order?.status === "Pending" && (
                      <Button
                        className="bg-blue-600 w-1/3  hover:bg-blue-700"
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
                )}
              </div>
              {!canRequestCancellation &&
                !canReschedule &&
                order?.status === "Pending" && (
                  <p className="text-sm text-red-500 mt-2 text-center">
                    Cancellation and rescheduling are no longer available for
                    this order.
                  </p>
                )}
            </footer>
          )}
        </main>
      )}

      {isCancelModalOpen && (
        <div className="fixed inset-0 max-w-sm mx-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                {localStorage.getItem("userRole") === "vendor"
                  ? "Cancel Order"
                  : "Cancel Order"}
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
      {localStorage.getItem("userRole") === "vendor" && (
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
  return (
    <div className="ml-auto flex items-center justify-center mr-2">
      <Link
        to={
          localStorage.getItem("userRole") === "vendor"
            ? "/vendor/profile"
            : "/profile"
        }
        className="ml-auto mr-2"
      >
        <UserCircle className="h-7 w-7 " />
      </Link>
    </div>
  );
};
