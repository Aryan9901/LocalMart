import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ShoppingCart,
  Search,
  ShoppingBag,
  Store,
  Package,
  History,
  PhoneCall,
  Phone,
} from "lucide-react";
import { ProductCard } from "../components/elements/ProductCard";
import { ProductDrawer } from "../components/elements/ProductDrawer";
import Header from "../components/elements/Header";

// Import the products data
import { products } from "../assets/products";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../hooks/useCart";

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("vegetables");
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { cart, addToCart } = useCart();

  const handleAddToCart = (product, quantity = 1, weight) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      weight: weight || product.weights[0],
    });
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
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

  return (
    <div className="min-h-screen sm:border-l sm:border-r bg-gray-50">
      <div className="max-w-sm  mx-auto">
        <Header cart={cart} />
        <div className="px-3 py-2 sticky top-0 bg-gray-50 z-10 shadow-sm">
          <Button
            onClick={() => navigate("search")}
            variant="outline"
            className="w-full flex items-center justify-start text-gray-500 mb-2"
          >
            <Search className="mr-2 h-4 w-4" />
            Search products...
          </Button>

          <Tabs
            defaultValue="vegetables"
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full bg-white rounded-lg px-1 py-0 gap-2 shadow-none">
              {["vegetables", "fruits", "dairy"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex-1 data-[state=active]:bg-[#39c55e] data-[state=active]:text-white rounded-md transition-all duration-200"
                >
                  <img
                    src={`/images/${tab}.png`}
                    alt=""
                    className="w-5 h-5 mr-2 inline-block"
                  />
                  <span className="capitalize">{tab}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <main className="container mx-auto px-4 py-2 mb-20">
          <div className="grid grid-cols-2 gap-4">
            {products[activeTab].map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleProductSelect}
                onAddToCart={() =>
                  handleAddToCart(product, 1, product.weights[0])
                }
              />
            ))}
          </div>
        </main>

        <ProductDrawer
          product={selectedProduct}
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          onAddToCart={handleAddToCart}
        />

        {cart.length > 0 && (
          <div className="fixed max-w-sm  mx-auto bottom-16 left-4 right-4">
            <Button
              className="w-10/12 mx-auto flex bg-[#39c55e] hover:bg-[#2ea34d] text-white shadow-lg transition-all duration-200"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {cart.length} {cart.length === 1 ? "item" : "items"} | Go to Cart
            </Button>
          </div>
        )}
        {userRole === "user" && (
          <TooltipProvider>
            <nav className="w-full fixed bottom-0 max-w-sm mx-auto py-2 px-4 flex items-center justify-around bg-white rounded-t-xl shadow-lg border-t z-20">
              {renderNavItem(
                "/history",
                <History className="h-6 w-6 text-gray-500" />,
                "My Orders"
              )}
              {renderNavItem(
                "/",
                <Store className="h-6 w-6 text-black" />,
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
                  <p>Cart</p>
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
      </div>
    </div>
  );
}
