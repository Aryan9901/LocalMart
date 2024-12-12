import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ProductCard } from "../components/elements/ProductCard";
import { ProductDrawer } from "../components/elements/ProductDrawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
      name: "Potato (Aloo)",
      price: 28,
      originalPrice: 33,
      discount: 8,
      image: "/images/onion.png",
      weights: ["500 gm", "1 kg", "2 kg"],
      defaultWeight: "1 kg",
    },
    {
      id: 2,
      name: "Tomato (Tamatar)",
      price: 35,
      originalPrice: 40,
      discount: 8,
      image: "/images/redchilli.png",
      weights: ["500 gm", "1 kg"],
      defaultWeight: "500 gm",
    },
  ],
};

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <h1 className="font-bold text-lg">Minity</h1>
          </div>
          <Button variant="outline" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="vegetables">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger
              value="vegetables"
              className="flex items-center data-[state=active]:bg-[#3e803a] data-[state=active]:text-white data-[state=active]:shadow-none gap-2"
            >
              <img src="/images/vegetables.png" alt="" className="w-6 h-6" />
              Vegetables
            </TabsTrigger>
            <TabsTrigger
              value="fruits"
              className="flex items-center data-[state=active]:bg-[#3e803a] data-[state=active]:text-white data-[state=active]:shadow-none gap-2"
            >
              <img src="/images/fruits.png" alt="" className="w-6 h-6" />
              Fruits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vegetables">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.vegetables.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(product) => {
                    setSelectedProduct(product);
                    setIsDrawerOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fruits">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.fruits.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(product) => {
                    setSelectedProduct(product);
                    setIsDrawerOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
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
        <div className="fixed bottom-4 left-4 right-4">
          <div className="container mx-auto">
            <Button className="w-full">
              {cart.length} {cart.length === 1 ? "item" : "items"} | Go to Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
