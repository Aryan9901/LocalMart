"use client";

import { useState } from "react";
import { ChevronLeft, MapPin, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function OrderDetails() {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const orderItems = [
    {
      name: "Potato (Aloo)",
      quantity: "1 kg x 1",
      price: 39,
      image: "/images/patato.png",
    },
    {
      name: "Chilli (Mirchi)",
      quantity: "100 gm x 1",
      price: 19,
      image: "/images/onion.png",
    },
    {
      name: "Tomato (Tamatar)",
      quantity: "500 gm x 1",
      price: 29,
      image: "/images/redchilli.png",
    },
    {
      name: "Mushroom",
      quantity: "5 pieces x 1",
      price: 34,
      image: "/images/tamato.png",
    },
  ];

  const orderSummary = {
    mrpTotal: 299,
    discount: 30,
    platformFees: 10,
    deliveryCharges: 0,
    total: 269,
  };

  const orderStatus = "Pending"; // This could be 'Pending', 'Delivered', or 'Cancelled'
  const timeSlot = "2-4 PM";
  const currentTime = new Date();
  const slotStartTime = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate(),
    14,
    0,
    0
  );
  const canRequestCancellation =
    currentTime.getTime() < slotStartTime.getTime() - 3600000; // 1 hour before slot start time

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

  const handleMarkDelivered = () => {
    // Implement mark as delivered logic here
    console.log("Order marked as delivered");
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
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 p-4">
        <section className="rounded-lg bg-white p-4">
          <h2 className="mb-4 font-medium">Order Items</h2>
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-md w-16"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.quantity}</p>
                </div>
                <p className="font-medium">₹ {item.price}</p>
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
            Time Slot: <span className="font-medium">{timeSlot}</span>
          </p>
        </section>

        {userRole === "vendor" ? (
          <footer className="bg-white p-4">
            <div className="mx-auto flex max-w-lg gap-2 items-center justify-between">
              <Button
                className="bg-red-600 w-1/2 hover:bg-red-500"
                onClick={() => setIsCancelModalOpen(true)}
              >
                Cancel Order
              </Button>
              <Button
                className="bg-blue-600 w-1/2 hover:bg-blue-700"
                onClick={handleMarkDelivered}
              >
                Mark Delivered
              </Button>
            </div>
          </footer>
        ) : (
          <footer className="bg-white p-4">
            <div className="mx-auto flex max-w-lg gap-2 items-center justify-between">
              <Button
                className="bg-red-600 w-full hover:bg-red-500"
                onClick={() => setIsCancelModalOpen(true)}
                disabled={!canRequestCancellation || orderStatus !== "Pending"}
              >
                Request Cancellation
              </Button>
            </div>
            {!canRequestCancellation && orderStatus === "Pending" && (
              <p className="text-sm text-red-500 mt-2 text-center">
                Cancellation is only available 1 hour before the delivery slot.
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
                {userRole === "vendor"
                  ? "Cancel Order"
                  : "Request Cancellation"}
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
              {userRole === "vendor"
                ? "Please select a reason for cancelling this order:"
                : "Please select a reason for requesting cancellation:"}
            </p>
            <RadioGroup onValueChange={setCancelReason} className="space-y-2">
              {cancelReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="cursor-pointer">
                    {" "}
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
              <Button onClick={handleCancelOrder}>
                {userRole === "vendor"
                  ? "Cancel Order"
                  : "Request Cancellation"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
