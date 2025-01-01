import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export function ProductDrawer({ product, isOpen, onClose, onAddToCart }) {
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (product) {
      const initialQuantities = product.productVariants.reduce(
        (acc, variant) => {
          acc[variant.inventoryId] = 0;
          return acc;
        },
        {}
      );
      setQuantities(initialQuantities);
    }
  }, [product]);

  const handleQuantityChange = (inventoryId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [inventoryId]: Math.max(0, (prev[inventoryId] || 0) + change),
    }));
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    return Object.entries(quantities).reduce(
      (total, [inventoryId, quantity]) => {
        const variant = product.productVariants.find(
          (v) => v.inventoryId === inventoryId
        );
        return total + (variant?.netPrice || product.netPrice) * quantity;
      },
      0
    );
  };

  const handleAddToCart = () => {
    if (!product) return;
    product.productVariants.forEach((variant) => {
      const quantity = quantities[variant.inventoryId];
      if (quantity > 0) {
        onAddToCart(product, quantity, variant);
      }
    });
    onClose();
  };

  if (!product) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="max-w-sm mx-auto py-0 px-0 rounded-t-3xl"
      >
        <div className="flex flex-col h-full">
          <div className="relative w-full h-40 rounded-t-2xl overflow-hidden">
            <img
              src={product.productImageUrl}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
            {product.mrp > product.netPrice && (
              <div className="absolute top-2 left-2 text-white bg-green-600 text-xs px-2 py-1 rounded">
                {(
                  ((product.mrp - product.netPrice) / product.mrp) *
                  100
                ).toFixed(0)}
                % OFF
              </div>
            )}
          </div>
          <div className="flex-grow overflow-y-auto px-4 py-2">
            <SheetHeader className="text-left mb-2">
              <SheetTitle className="text-xl font-bold">
                {product.productName}
              </SheetTitle>
            </SheetHeader>
            <div className="grid gap-2">
              {product.productVariants.map((variant) => (
                <div
                  key={variant.inventoryId}
                  className="flex items-center justify-between border rounded-lg p-2"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium">
                      {variant.variant} {variant.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {localStorage.getItem("userRole") === "user" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(variant.inventoryId, -1)
                        }
                        disabled={quantities[variant.inventoryId] <= 0}
                        className="h-7 w-7 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                    <span className="w-8 text-center">
                      {quantities[variant.inventoryId] || 0}
                    </span>
                    {localStorage.getItem("userRole") === "user" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(variant.inventoryId, 1)
                        }
                        className="h-7 w-7 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {localStorage.getItem("userRole") === "user" && (
            <div className="border-t bg-white px-4 py-3 mt-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">
                  ₹{calculateTotalPrice()}
                </span>
              </div>
              <Button
                className="w-full bg-blue-700 hover:bg-blue-700 text-white py-4 cursor-pointer"
                onClick={handleAddToCart}
                disabled={Object.values(quantities).every((v) => v === 0)}
              >
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
