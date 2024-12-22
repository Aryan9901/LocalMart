import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ProductCard } from "../components/elements/ProductCard";
import { ProductDrawer } from "../components/elements/ProductDrawer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "../components/elements/Header";

// Sample data - replace with your actual data
const products = {
  vegetables: [
    {
      id: 1,
      name: "Potato (Aloo)",
      price: 28,
      originalPrice: 33,
      discount: 8,
      image: "/images/patato.png",
      weights: ["500 gm", "1 kg", "2 kg"],
      defaultWeight: "1 kg",
    },
    {
      id: 2,
      name: "Tomato (Tamatar)",
      price: 35,
      originalPrice: 40,
      discount: 8,
      image: "/images/tamato.png",
      weights: ["500 gm", "1 kg"],
      defaultWeight: "500 gm",
    },
    // Add more vegetables...
  ],
  fruits: [
    {
      id: 1,
      name: "Apple",
      price: 28,
      originalPrice: 33,
      discount: 8,
      image: "/images/onion.png",
      weights: ["500 gm", "1 kg", "2 kg"],
      defaultWeight: "1 kg",
    },
    {
      id: 2,
      name: "Banana",
      price: 35,
      originalPrice: 40,
      discount: 8,
      image: "/images/redchilli.png",
      weights: ["500 gm", "1 kg"],
      defaultWeight: "500 gm",
    },
  ],
  dairy: [
    {
      id: 1,
      name: "Milk",
      price: 28,
      originalPrice: 33,
      discount: 8,
      image: "/images/onion.png",
      weights: ["500 ml", "1 L", "2 L"],
      defaultWeight: "1 L",
    },
    {
      id: 2,
      name: "Cheese",
      price: 35,
      originalPrice: 40,
      discount: 8,
      image: "/images/redchilli.png",
      weights: ["200 gm", "500 gm"],
      defaultWeight: "200 gm",
    },
  ],
};

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("vegetables");

  const handleAddToCart = (items) => {
    if (Array.isArray(items)) {
      setCart((prevCart) => [...prevCart, ...items]);
    } else {
      setCart((prevCart) => [...prevCart, items]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 sm:border-l sm:border-r">
      <div className="max-w-sm mx-auto">
        <Header cart={cart} />

        <main className="container mx-auto px-4 py-6 mb-20">
          <div className="grid grid-cols-2 gap-2">
            {products[activeTab].map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(product) => {
                  setSelectedProduct(product);
                  setIsDrawerOpen(true);
                }}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </main>

        <ProductDrawer
          product={selectedProduct}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedProduct(null);
          }}
          onAddToCart={handleAddToCart}
        />

        {cart.length > 0 && (
          <div className="fixed max-w-sm mx-auto bottom-16 left-4 right-4">
            <div className="container mx-auto">
              <Button className="w-11/12 mx-auto block bg-[#39c55e] hover:bg-[#2ea34d] text-white">
                {cart.length} {cart.length === 1 ? "item" : "items"} | Go to
                Cart
              </Button>
            </div>
          </div>
        )}
        <div className="fixed max-w-sm mx-auto bottom-0   left-0 right-0">
          <div className="container mx-auto px-0 py-0">
            <Tabs
              defaultValue="vegetables"
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="w-full h-full rounded-none bg-white py-0 items-start gap-3 justify-between">
                <TabsTrigger
                  value="vegetables"
                  className="flex items-center data-[state=active]:shadow-none data-[state=active]:text-black opacity-85 data-[state=active]:opacity-100 border-t data-[state=active]:bg-transparent rounded-none h-full border-transparent data-[state=active]:border-[#39c55e] text-gray-500 flex-col justify-center gap-1 flex-1"
                >
                  <img
                    src="/images/vegetables.png"
                    alt=""
                    className="w-5 h-5"
                  />
                  <span className="text-xs">Vegetables</span>
                </TabsTrigger>
                <TabsTrigger
                  value="fruits"
                  className="flex items-center border-transparent data-[state=active]:shadow-none data-[state=active]:text-black opacity-85 data-[state=active]:opacity-100 border-t data-[state=active]:bg-transparent rounded-none h-full data-[state=active]:border-[#39c55e] text-gray-500 flex-col justify-center gap-1 flex-1"
                >
                  <img src="/images/fruits.png" alt="" className="w-5 h-5" />
                  <span className="text-xs">Fruits</span>
                </TabsTrigger>
                <TabsTrigger
                  value="dairy"
                  className="flex items-center border-transparent data-[state=active]:shadow-none data-[state=active]:text-black opacity-85 data-[state=active]:opacity-100 border-t data-[state=active]:bg-transparent rounded-none h-full data-[state=active]:border-[#39c55e] text-gray-500 flex-col justify-center gap-1 flex-1"
                >
                  <img src="/images/dairy.png" alt="" className="w-5 h-5" />
                  <span className="text-xs">Dairy</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
