"use client";

import { ChevronLeft, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

export default function OrderDetails() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/vendor" className="text-gray-600">
            <ChevronLeft className="h-6 w-6" />
          </Link>
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

        <footer className="  bg-white p-4">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="payment" className="rounded-sm" />
              <label htmlFor="payment" className="text-sm font-medium">
                Payment Pending
              </label>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Mark Delivered
            </Button>
          </div>
        </footer>
      </main>
    </div>
  );
}
