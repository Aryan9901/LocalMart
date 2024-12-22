import React from "react";
import { BadgeAlert, BadgeCheck, BadgeInfo, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center border-b">
        <Link to="/">
          <button className="p-1 -ml-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-lg font-medium flex-1 text-center mr-6">
          Order History
        </h1>
      </div>

      {/* Order List */}
      <div className="p-4 max-w-sm mx-auto">
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
    </div>
  );
};

export default OrderHistory;
