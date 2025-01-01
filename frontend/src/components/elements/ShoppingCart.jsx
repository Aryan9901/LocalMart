import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  MapPin,
  Phone,
  Edit2,
  Minus,
  Plus,
  Store,
  History,
  ShoppingCartIcon,
  UserCircle,
  PlusCircle,
  Clock,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { VENDOR_ID } from "../../constant/constant";

const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const date = new Date(0, 0, 0, hours, minutes);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ShoppingCart = () => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDay, setSelectedDay] = useState(() => {
    if (new Date().getHours() > 18) {
      return "tomorrow";
    } else {
      return "today";
    }
  });
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const [address, setAddress] = useState({
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    contactNo: "",
    country: "",
    district: "",
    id: "",
    pinCode: "",
    state: "",
    type: "",
  });

  const [tempAddress, setTempAddress] = useState({ ...address });
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [selfPickup, setSelfPickup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const timeSlots = [
    "08:00-10:00",
    "10:00-12:00",
    "12:00-14:00",
    "14:00-16:00",
    "16:00-18:00",
    "18:00-20:00",
  ];

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

  const handleUpdateQuantity = (id, variantId, change) => {
    updateQuantity(id, variantId, change);
  };

  const calculateTotal = () => {
    console.log(cart);

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const mrpTotal = cart.reduce(
      (sum, item) => sum + item.mrp * item.quantity,
      0
    );
    const discount = mrpTotal - subtotal;
    const platformFees = 0; // Fixed platform fees
    const deliveryCharges = 0; // Delivery is 0 for now
    return {
      subtotal,
      mrpTotal,
      discount,
      platformFees,
      deliveryCharges,
      total: subtotal + platformFees + deliveryCharges,
    };
  };

  const totals = calculateTotal();

  const handleAddressChange = (field, value) => {
    setTempAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAddress = async () => {
    console.log(tempAddress);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;
    tempAddress.type = "home";
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/rest/subziwale/api/v1/address`,
        tempAddress,
        {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId,
          },
        }
      );

      fetchAddress();
    } catch (error) {
      toast.error("Some Error occured");
      console.error(error);
    } finally {
      setLoading(true);
    }
  };

  const handleSubmit = async () => {
    // setIsSubmitting(true);
    const orderData = {
      mrp: totals.mrpTotal,
      discount: totals.discount,
      platformFees: totals.platformFees,
      deliveryCharges: totals.deliveryCharges,
      total: totals.total,
      contactNo: address.contactNo,
      deliveryAddress: `${address.addressLineOne}, ${address.addressLineTwo}, ${address.city}, ${address.district}, ${address.state} ${address.country} ${address.pinCode}`,
      status: "Pending",
      orderDate: new Date(),
      deliveryDate:
        selectedDay === "today"
          ? new Date().toISOString().split("T")[0]
          : new Date(Date.now() + 86400000).toISOString().split("T")[0],
      timeSlot: expressDelivery ? "Within 1 hour" : selectedTimeSlot,
      expressDelivery,
      selfPickup,
      note: notes,
      items: cart.map((item) => ({
        productId: item.id,
        inventoryId: item.variant.inventoryId,
        productName: item.name,
        quantity: item.quantity,
        unit: item.variant.unit,
        mrp: item.mrp,
        netPrice: item.price,
      })),
    };

    const user = JSON.parse(localStorage.getItem("user"));

    const vendorId = VENDOR_ID;
    const userId = user.id;
    const addressId = address.id;

    console.log(orderData);
    console.log(vendorId);
    console.log(userId);
    console.log(addressId);

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/rest/subziwale/api/v1/order?addressId=${addressId}`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Vendor-Id": vendorId,
            "X-User-Id": userId,
          },
        }
      );
      console.log("Order submitted successfully", response.data);
      toast.success("Order placed successfully!");
      clearCart();
      // navigate("/order-confirmation", {
      //   state: { orderId: response.data.orderId },
      // });
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSlotAvailable = (slot) => {
    const currentTime = new Date();
    const [start] = slot.split("-");
    const [startHours, startMinutes] = start.split(":");
    const slotStartTime = new Date();
    slotStartTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

    if (selectedDay === "tomorrow") {
      return true;
    } else {
      return slotStartTime > currentTime;
    }
  };

  useEffect(() => {
    const availableSlots = timeSlots.filter((slot) => {
      if (selectedDay === "tomorrow") {
        return true;
      } else {
        return isSlotAvailable(slot);
      }
    });

    if (availableSlots.length > 0 && !selectedTimeSlot) {
      setSelectedTimeSlot(availableSlots[0]);
    } else if (availableSlots.length === 0) {
      setSelectedTimeSlot("");
    }
  }, [selectedDay]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.id;

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/rest/subziwale/api/v1/address`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId,
          },
        }
      );

      setAddress(data[0]);
      // console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen ">
      {loading && (
        <div className="fixed h-screen left-1/2 -translate-x-1/2 z-50 bg-[#00000046] w-full max-w-sm">
          <div className="loader"></div>
        </div>
      )}
      <div className="max-w-sm mx-auto bg-white shadow-md">
        {/* Header */}
        <div className="flex items-center p-4 border-b sticky top-0 bg-white z-10">
          <Link to="/">
            <ChevronLeft className="w-6 h-6 mr-2 text-gray-600" />
          </Link>
          <h1 className="text-lg font-semibold">Checkout</h1>
          <UserMenu />
        </div>

        {/* Order Items */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Order Items</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/search")}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          {cart.map((item) => (
            <div
              key={`${item.id}-${item.variant.inventoryId}`}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center">
                <img
                  src={item.image || `/images/${item.name.toLowerCase()}.png`}
                  alt={item.name}
                  className="w-10 h-10 mr-2 rounded object-cover"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.variant.variant} {item.variant.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() =>
                    handleUpdateQuantity(item.id, item.variant.inventoryId, -1)
                  }
                  className="p-1 bg-gray-200 rounded-full"
                >
                  <Minus size={16} />
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleUpdateQuantity(item.id, item.variant.inventoryId, 1)
                  }
                  className="p-1 bg-gray-200 rounded-full"
                >
                  <Plus size={16} />
                </button>
                <span className="ml-2 font-semibold">
                  ₹ {item.price * item.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-2">Order Summary</h2>
          <div className="flex justify-between mb-1">
            <span>MRP Total</span>
            <span>₹ {totals.mrpTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Discount</span>
            <span className="text-green-500">
              - ₹ {totals.discount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Platform fees</span>
            <span>₹ {totals.platformFees.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Delivery Charges</span>
            <span>₹ {totals.deliveryCharges.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold mt-2">
            <span>TOTAL</span>
            <span>₹ {totals.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Delivery Details</h2>
            <Sheet
              onOpenChange={(open) => {
                if (open) {
                  setTempAddress({ ...address });
                }
              }}
            >
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className=" max-w-sm mx-auto rounded-t-[10px] py-2 overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle>Delivery Details</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-2 px-2 sm:px-4">
                  <div className="grid grid-cols-1  gap-1">
                    <div className="relative ">
                      <label className="text-sm text-muted-foreground">
                        House No / Flat / Floor / Building :
                      </label>
                      <Input
                        className="mt-1 focus-visible:ring-1 focus-visible:ring-offset-0"
                        value={tempAddress.addressLineOne}
                        onChange={(e) =>
                          handleAddressChange("addressLineOne", e.target.value)
                        }
                      />
                    </div>
                    <div className="relative ">
                      <label className="text-sm text-muted-foreground">
                        Locality / Area / Sector :
                      </label>
                      <Input
                        className="mt-1 focus-visible:ring-1 focus-visible:ring-offset-0"
                        value={tempAddress.addressLineTwo}
                        onChange={(e) =>
                          handleAddressChange("addressLineTwo", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <label className="text-sm text-muted-foreground">
                          Pin Code :
                        </label>
                        <Input
                          className="mt-1 focus-visible:ring-1 focus-visible:ring-offset-0"
                          value={tempAddress.pinCode}
                          onChange={(e) =>
                            handleAddressChange("pinCode", e.target.value)
                          }
                        />
                      </div>
                      <div className="relative">
                        <label className="text-sm text-muted-foreground">
                          City :
                        </label>
                        <Input
                          className="mt-1 focus-visible:ring-1 focus-visible:ring-offset-0"
                          value={tempAddress.city}
                          onChange={(e) =>
                            handleAddressChange("city", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative ">
                        <label className="text-sm text-muted-foreground">
                          District :
                        </label>
                        <Input
                          className="mt-1 focus-visible:ring-1 focus-visible:ring-offset-0"
                          value={tempAddress.district}
                          onChange={(e) =>
                            handleAddressChange("district", e.target.value)
                          }
                        />
                      </div>
                      <div className="relative">
                        <label className="text-sm text-muted-foreground">
                          State/UT :
                        </label>
                        <Input
                          className="mt-1 focus-visible:ring-1 focus-visible:ring-offset-0"
                          value={tempAddress.state}
                          onChange={(e) =>
                            handleAddressChange("state", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="text-sm text-muted-foreground">
                        Country:
                      </label>
                      <Input
                        className="mt-1 focus-visible:ring-1 focus-visible:ring-offset-0"
                        value={tempAddress.country}
                        onChange={(e) =>
                          handleAddressChange("country", e.target.value)
                        }
                      />
                    </div>
                    <div className="relative">
                      <label className="text-sm text-muted-foreground">
                        Contact No :
                      </label>
                      <Input
                        className="mt-1 focus-visible:ring-1 focus-visible:ring-offset-0"
                        value={tempAddress.contactNo}
                        onChange={(e) =>
                          handleAddressChange("contactNo", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <SheetClose className="w-full">
                    <Button
                      className="w-full h-12 mt-0 text-base bg-blue-500 hover:bg-blue-600 rounded-full"
                      onClick={handleSaveAddress}
                    >
                      Save Details
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {!loading && (
            <>
              <div className="flex items-start mb-2">
                <MapPin className="w-5 h-5 mr-2 mt-1" />
                <p>{`${address?.addressLineOne}, ${address?.addressLineTwo}, ${address?.city}, ${address?.district}, ${address?.country} ${address?.pinCode}`}</p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <p>{address?.contactNo}</p>
              </div>
            </>
          )}
        </div>

        {/* Time Slot */}
        <div className="p-4 border-b select-none">
          <h2 className="font-semibold mb-2">Delivery Time</h2>
          <div className="flex items-center justify-between mb-4 select-none">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="expressDelivery"
                checked={expressDelivery}
                onChange={(e) => {
                  setExpressDelivery(e.target.checked);
                }}
                className="mr-2"
                disabled={selfPickup}
              />
              <label
                htmlFor="expressDelivery"
                className="text-sm cursor-pointer"
              >
                Express (within 1 hour)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="selfPickup"
                checked={selfPickup}
                onChange={(e) => {
                  setSelfPickup(e.target.checked);
                }}
                className="mr-2"
              />
              <label htmlFor="selfPickup" className="text-sm cursor-pointer">
                Self Pickup
              </label>
            </div>
          </div>

          <div className="flex mb-4">
            <button
              className={`flex-1 py-2 rounded-l transition-colors ${
                expressDelivery
                  ? "cursor-not-allowed bg-gray-300 opacity-55"
                  : selectedDay === "today"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedDay("today")}
              disabled={expressDelivery}
            >
              Today
            </button>
            <button
              className={`flex-1 py-2 rounded-r transition-colors ${
                expressDelivery
                  ? "cursor-not-allowed bg-gray-300 opacity-55"
                  : selectedDay === "tomorrow"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedDay("tomorrow")}
              disabled={expressDelivery}
            >
              Tomorrow
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => {
              const [start, end] = slot.split("-");
              const displaySlot = `${formatTime(start)} - ${formatTime(end)}`;
              return (
                <button
                  key={slot}
                  className={`py-2 px-2 text-sm rounded transition-colors ${
                    expressDelivery
                      ? "cursor-not-allowed bg-gray-300 opacity-55"
                      : selectedTimeSlot === slot
                      ? "bg-blue-500 text-white"
                      : isSlotAvailable(slot)
                      ? "bg-gray-100  text-gray-700 hover:bg-gray-300"
                      : "bg-gray-300  opacity-70 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    isSlotAvailable(slot) && setSelectedTimeSlot(slot)
                  }
                  disabled={!isSlotAvailable(slot) || expressDelivery}
                >
                  <Clock className="w-4 h-4 inline-block mr-2" />
                  {displaySlot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="p-4">
          <h2 className="font-semibold mb-2">Notes</h2>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Add your notes here"
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        {/* Confirm Button */}
        <div className="px-4 pt-2 py-4 border-t mb-12 bg-white">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Placing Order..." : "Confirm"}
          </button>
        </div>
      </div>
      <TooltipProvider>
        <nav className="w-full fixed bottom-0 max-w-sm mx-auto py-2 px-4 flex items-center justify-around bg-white rounded-t-xl shadow-lg border-t z-20">
          {renderNavItem(
            "/history",
            <History className="h-6 w-6 text-gray-500" />,
            "My Orders"
          )}
          {renderNavItem(
            "/",
            <Store className="h-6 w-6 text-gray-500" />,
            "My Store"
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <ShoppingCartIcon className="h-6 w-6 text-black cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Cart</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Phone
                onClick={() => {
                  const user = JSON.parse(localStorage.getItem("user"));
                  window.open(`tel:${user.contactNo}`);
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
    </div>
  );
};

export default ShoppingCart;

const UserMenu = () => {
  return (
    <Link to="/profile" className="ml-auto mr-2">
      <UserCircle className="h-7 w-7" />
    </Link>
  );
};
