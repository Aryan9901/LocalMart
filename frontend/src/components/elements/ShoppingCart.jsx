import React, { useState } from "react";
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
  User,
  StoreIcon,
  LogOut,
  HistoryIcon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ShoppingCart = () => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("9:00 AM");
  const [selectedDay, setSelectedDay] = useState("today");
  const [orderItems, setOrderItems] = useState([
    { id: 1, name: "Potato (Aloo)", quantity: 1, price: 39, unit: "1 kg x 1" },
    {
      id: 2,
      name: "Chilli (Mirchi)",
      quantity: 1,
      price: 19,
      unit: "100 gm x 1",
    },
    {
      id: 3,
      name: "Tomato (Tamatar)",
      quantity: 1,
      price: 29,
      unit: "500 gm x 1",
    },
    { id: 4, name: "Mushroom", quantity: 1, price: 34, unit: "5 pieces x 1" },
  ]);
  const [address, setAddress] = useState({
    house: "1258, Gali No. 14, Agarkhar",
    area: "Jamnipali",
    district: "Korba",
    state: "Chhattisgarh",
    pincode: "495450",
    mobile: "+91 7898411475",
  });
  const [tempAddress, setTempAddress] = useState({ ...address });
  const [notes, setNotes] = useState("");

  const timeSlots = [
    "8 - 10 AM",
    "10 - 12 PM",
    "12 - 2 PM",
    "2 - 4 PM",
    "4 - 6 PM",
    "6 - 8 PM",
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

  const updateQuantity = (id, change) => {
    setOrderItems(
      orderItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = 30;
    const platformFees = 0;
    const deliveryCharges = 0;
    return {
      subtotal,
      discount,
      platformFees,
      deliveryCharges,
      total: subtotal - discount + platformFees + deliveryCharges,
    };
  };

  const totals = calculateTotal();

  const handleAddressChange = (field, value) => {
    setTempAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAddress = () => {
    setAddress(tempAddress);
  };

  const handleSubmit = () => {
    console.log("Order submitted", {
      items: orderItems,
      totals,
      deliveryDay: selectedDay,
      deliveryTime: selectedTimeSlot,
      address,
      notes,
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
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
          <h2 className="font-semibold mb-2">Order Items</h2>
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center">
                <img
                  src={`/images/patato.png`}
                  alt={item.name}
                  className="w-10 h-10 mr-2 rounded"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.unit}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 bg-gray-200 rounded-full"
                >
                  <Minus size={16} />
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
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
            <span>₹ {totals.subtotal}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Discount</span>
            <span className="text-green-500">- ₹ {totals.discount}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Platform fees</span>
            <span>₹ {totals.platformFees}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Delivery Charges</span>
            <span>₹ {totals.deliveryCharges}</span>
          </div>
          <div className="flex justify-between font-semibold mt-2">
            <span>TOTAL</span>
            <span>₹ {totals.total}</span>
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
                className="h-[90vh] sm:h-[90vh] max-w-sm mx-auto rounded-t-[10px] overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle>Delivery Details</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4 px-2 sm:px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative sm:col-span-2">
                      <label className="text-sm text-muted-foreground">
                        House No / Flat / Floor / Building :
                      </label>
                      <Input
                        className="mt-1"
                        value={tempAddress.house}
                        onChange={(e) =>
                          handleAddressChange("house", e.target.value)
                        }
                      />
                    </div>
                    <div className="relative sm:col-span-2">
                      <label className="text-sm text-muted-foreground">
                        Locality / Area / Sector :
                      </label>
                      <Input
                        className="mt-1"
                        value={tempAddress.area}
                        onChange={(e) =>
                          handleAddressChange("area", e.target.value)
                        }
                      />
                    </div>
                    <div className="relative">
                      <label className="text-sm text-muted-foreground">
                        Pin Code :
                      </label>
                      <Input
                        className="mt-1"
                        value={tempAddress.pincode}
                        onChange={(e) =>
                          handleAddressChange("pincode", e.target.value)
                        }
                      />
                    </div>
                    <div className="relative">
                      <label className="text-sm text-muted-foreground">
                        District :
                      </label>
                      <Input
                        className="mt-1"
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
                        className="mt-1"
                        value={tempAddress.state}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                      />
                    </div>
                    <div className="relative">
                      <label className="text-sm text-muted-foreground">
                        Mobile :
                      </label>
                      <Input
                        className="mt-1"
                        value={tempAddress.mobile}
                        onChange={(e) =>
                          handleAddressChange("mobile", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <SheetClose className="w-full">
                    <Button
                      className="w-full h-12 mt-4 text-base bg-blue-500 hover:bg-blue-600 rounded-full"
                      onClick={handleSaveAddress}
                    >
                      Save Details
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-start mb-2">
            <MapPin className="w-5 h-5 mr-2 mt-1" />
            <p>{`${address.house}, ${address.area}, ${address.district}, ${address.state}, ${address.pincode}`}</p>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            <p>{address.mobile}</p>
          </div>
        </div>

        {/* Time Slot */}
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-2">Time Slot</h2>
          <div className="flex mb-4">
            <button
              className={`flex-1 py-2 rounded-l transition-colors ${
                selectedDay === "today"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedDay("today")}
            >
              Today
            </button>
            <button
              className={`flex-1 py-2 rounded-r transition-colors ${
                selectedDay === "tomorrow"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedDay("tomorrow")}
            >
              Tomorrow
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                className={`py-2 rounded transition-colors ${
                  selectedTimeSlot === slot
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedTimeSlot(slot)}
              >
                {slot}
              </button>
            ))}
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
            className="w-full py-3 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition-colors"
          >
            Confirm
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
    </div>
  );
};

export default ShoppingCart;

const UserMenu = () => {
  return (
    <Link to="/profile" className="ml-auto mr-2">
      <UserCircle className="h-7 w-7 " />
    </Link>
  );
};
