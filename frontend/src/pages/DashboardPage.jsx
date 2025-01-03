import React, { useEffect, useState, useCallback } from "react";
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
  Phone,
} from "lucide-react";
import { ProductCard } from "@/components/elements/ProductCard";
import { ProductDrawer } from "@/components/elements/ProductDrawer";
import Header from "@/components/elements/Header";
import { useCart } from "@/hooks/useCart";
import axios from "axios";
import { VENDOR_ID } from "../constant/constant";

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Vegetables");
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = useCallback(
    (product, quantity, variant) => {
      addToCart({
        id: product.productId,
        name: product.productName,
        image: product.productImageUrl,
        mrp: variant.mrp || product.mrp,
        price: variant.netPrice || product.netPrice,
        quantity: quantity,
        variant: variant,
      });
    },
    [addToCart]
  );

  const handleRemoveFromCart = useCallback(
    (productId, variantId) => {
      removeFromCart(productId, variantId);
    },
    [removeFromCart]
  );

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

  const fetchProducts = useCallback(
    async (controller) => {
      try {
        setLoading(true);
        const vendorId = VENDOR_ID;
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/rest/subziwale/api/v1/products?category=${activeTab}`,
          {
            headers: {
              "X-Vendor-Id": vendorId,
            },
            signal: controller.signal,
          }
        );

        setProducts(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    },
    [activeTab]
  );

  useEffect(() => {
    const controller = new AbortController();
    window.scrollTo(0, 0);
    fetchProducts(controller);

    return () => controller.abort();
  }, [activeTab, fetchProducts]);

  return (
    <div className="min-h-screen sm:border-l sm:border-r bg-gray-50">
      <div className="max-w-sm mx-auto">
        <Header cart={cart} />
        <div className="px-3 py-2 sticky top-0 bg-gray-50 z-10 shadow-sm">
          <Button
            onClick={() => navigate("search")}
            variant="outline"
            className="w-full flex items-center justify-start text-gray-500 mb-2"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
            <span className="italic">
              (e.g. Aloo, Pyaaz, Apple, Milk, Paneer)
            </span>
          </Button>

          <Tabs
            defaultValue="Vegetables"
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full bg-white rounded-lg px-1 py-0 gap-2 shadow-none">
              {["Vegetables", "Fruits", "Dairy"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex-1 data-[state=active]:bg-[#39c55e] data-[state=active]:text-white rounded-md transition-all duration-200"
                >
                  <img
                    src={`/${tab}.png`}
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
            {loading ? (
              <div className="col-span-2 flex justify-center items-center h-64">
                <div className="loader"></div>
              </div>
            ) : (
              products?.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                />
              ))
            )}
          </div>
        </main>

        <ProductDrawer
          product={selectedProduct}
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          onAddToCart={handleAddToCart}
        />

        {localStorage.getItem("userRole") === "user" && cart.length > 0 && (
          <div className="fixed max-w-sm mx-auto bottom-16 left-4 right-4">
            <Button
              className="w-10/12 mx-auto flex bg-[#39c55e] hover:bg-[#2ea34d] text-white shadow-lg transition-all duration-200"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {cart.length} {cart.length === 1 ? "item" : "items"} | Go to Cart
            </Button>
          </div>
        )}

        {localStorage.getItem("userRole") === "user" && (
          <TooltipProvider>
            <nav className="w-full fixed bottom-0 max-w-sm mx-auto py-2 px-4 flex items-center justify-around bg-white  shadow-lg border-t z-20">
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
                <TooltipContent>
                  <p>Cart</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Phone
                    onClick={() => {
                      window.open(`tel:+918851771039`);
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
        )}
        {localStorage.getItem("userRole") === "vendor" && (
          <TooltipProvider>
            <nav className="w-full fixed bottom-0 max-w-sm mx-auto py-2 px-4 flex items-center justify-around bg-white  shadow-lg border-t z-20">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/vendor" className="p-2">
                    <ShoppingBag className="h-6 w-6 text-gray-500" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>My Orders</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/vendor/store" className="p-2">
                    <Store className="h-6 w-6 text-black" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>My Store</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/vendor/product/pricing" className="p-2">
                    <Package className="h-6 w-6 text-gray-500" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>My Products</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Phone
                    onClick={() => {
                      window.open(`tel:+919899784200}`);
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
        )}
      </div>
    </div>
  );
}
