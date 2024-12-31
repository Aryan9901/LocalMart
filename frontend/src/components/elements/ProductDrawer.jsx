import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export function ProductDrawer({ product, isOpen, onClose }) {
  const [quantities, setQuantities] = useState({});
  const [drawerHeight, setDrawerHeight] = useState("100vh");
  const { userRole } = useAuth();

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      setDrawerHeight(`${window.innerHeight}px`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    if (product) {
      const initialQuantities = product.weights.reduce((acc, weight) => {
        acc[weight] = 0;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [product]);

  const handleQuantityChange = (weight, change) => {
    const newQuantity = (quantities[weight] || 0) + change;
    if (newQuantity >= 0) {
      setQuantities((prev) => ({
        ...prev,
        [weight]: newQuantity,
      }));
    }
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    return Object.entries(quantities).reduce((total, [weight, quantity]) => {
      return total + product.price * quantity;
    }, 0);
  };

  const handleGoToCart = () => {
    if (!product) return;
    const selectedItems = Object.entries(quantities)
      .filter(([weight, quantity]) => quantity > 0)
      .map(([weight, quantity]) => ({
        ...product,
        selectedWeight: weight,
        quantity,
        totalPrice: product.price * quantity,
      }));

    console.log("Cart contents:", selectedItems);
    onClose();
  };

  if (!product) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className={`rounded-t-2xl p-0 ${drawerHeight} max-w-sm mx-auto`}
      >
        <div className="flex flex-col h-full">
          <div className="relative w-full h-40 rounded-t-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <div className="absolute top-2 left-2 text-white bg-green-600 text-xs px-2 py-1 rounded">
                {product.discount}% OFF
              </div>
            )}
          </div>
          <div className="flex-grow overflow-y-auto px-4 py-2">
            <SheetHeader className="text-left mb-2">
              <SheetTitle className="text-xl font-bold text-black">
                {product.name}
              </SheetTitle>
            </SheetHeader>
            <div className="grid gap-2">
              {product.weights.map((weight, index) => (
                <div
                  key={weight}
                  className={cn(
                    "flex items-center justify-between border rounded-lg p-2",
                    quantities[weight] > 0
                      ? "border-blue-500 bg-white"
                      : "border-blue-100"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium leading-none">
                      {weight}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        userRole === "user" && handleQuantityChange(weight, -1)
                      }
                      disabled={userRole !== "user" || quantities[weight] <= 0}
                      className="h-7 w-7 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-black">
                      {quantities[weight] || 0}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        userRole === "user" && handleQuantityChange(weight, 1)
                      }
                      disabled={userRole !== "user"}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {userRole === "user" && (
            <div className="border-t bg-white px-4 py-3 mt-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-black">Total:</span>
                <span className="font-bold text-lg text-black">
                  ₹{calculateTotalPrice()}
                </span>
              </div>
              <Button
                className="w-full bg-blue-800 hover:bg-blue-700 text-white py-6"
                onClick={handleGoToCart}
                disabled={Object.values(quantities).every((v) => v === 0)}
              >
                Go To Cart
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
