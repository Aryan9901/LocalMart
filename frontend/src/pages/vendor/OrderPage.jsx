import { ChartNoAxesGantt, ChevronLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";

const orders = [
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
  },
  {
    id: "7",
    customerName: "Priya Sharma",
    initials: "PS",
    timestamp: "24th Dec, 2024 2:45 PM",
    amount: 180,
    items: ["/images/patato.png", , "/images/patato.png"],
    status: "completed",
  },
];

function OrderCard({ order }) {
  const navigate = useNavigate();

  return (
    <div
      className="p-3 bg-white rounded-lg border shadow-sm cursor-pointer"
      onClick={() => {
        navigate("/vendor/orders/id");
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="text-sm font-medium">{order.initials}</span>
          </div>
          <div>
            <p className="font-medium">{order.customerName}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span className="h-4 w-4">🕒</span>
              {order.timestamp}
            </div>
          </div>
        </div>
        <p className="font-medium">₹ {order.amount}</p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="h-12 w-12 rounded-lg overflow-hidden border bg-gray-50"
          >
            <img
              src={item}
              alt="Product"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {order.extraItems && (
          <div className="h-12 w-12 rounded-lg border bg-gray-50 flex items-center justify-center text-sm text-gray-600">
            +{order.extraItems}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderPage() {
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  return (
    <div className="min-h-screen sm:border-l sm:border-r bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <Link to="/vendor">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-medium">Orders</h1>
        </div>
        <Link to="/vendor/product/pricing">
          <ChartNoAxesGantt className="h-6 w-6 cursor-pointer" />
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="w-full justify-start h-12 p-0 bg-transparent border-b rounded-none">
          <TabsTrigger
            value="pending"
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:shadow-none"
          >
            Pending Orders
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:shadow-none"
          >
            Completed Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="px-2 space-y-2 py-2">
          {pendingOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="px-2 py-2 space-y-2">
          {completedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
