import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Plus, Minus } from "lucide-react";

export function ProductCard({
  product,
  onSelect,
  onAddToCart,
  onRemoveFromCart,
}) {
  const [quantity, setQuantity] = useState(0);
  const { cart } = useCart();

  useEffect(() => {
    const cartItem = cart.find(
      (item) =>
        item.id === product.productId &&
        item.variant.inventoryId === product.productVariants[0].inventoryId
    );
    setQuantity(cartItem ? cartItem.quantity : 0);
  }, [cart, product.productId, product.productVariants]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (quantity === 0) {
      setQuantity(1);
      onAddToCart(product, 1, product.productVariants[0]);
    }
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    if (quantity < 9) {
      setQuantity(quantity + 1);
      onAddToCart(product, 1, product.productVariants[0]);
    }
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(quantity - 1);
      onAddToCart(product, -1, product.productVariants[0]);
    } else if (quantity === 1) {
      setQuantity(0);
      onRemoveFromCart(
        product.productId,
        product.productVariants[0].inventoryId
      );
    }
  };

  const discount = (
    ((product.mrp - product.netPrice) / product.mrp) *
    100
  ).toFixed(0);

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden border relative ${
        product?.available ? "cursor-pointer" : "opacity-65 cursor-not-allowed"
      }`}
      onClick={() => {
        if (product?.available) {
          onSelect(product);
        }
      }}
    >
      {!product?.available && (
        <h2 className="absolute text-black font-bold z-50 top-1/2 text-center w-full -translate-y-1/2 text-balance text-base">
          Not Available
        </h2>
      )}
      <div className="relative">
        {Number(discount) > 0 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
        <img
          src={product.productImageUrl}
          alt={product.productName}
          className="w-full h-32 object-cover"
        />
        {localStorage.getItem("userRole") === "user" && (
          <div className="absolute -bottom-3 right-2">
            {quantity === 0 ? (
              <Button
                variant="secondary"
                size="sm"
                className="border border-green-600"
                onClick={handleAddToCart}
                disabled={!product?.available}
              >
                Add
              </Button>
            ) : (
              <div className="flex items-center bg-white border border-green-600 rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-8 w-8"
                  onClick={handleDecrease}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-8 w-8"
                  onClick={handleIncrease}
                  disabled={quantity >= 9}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <h3 className="font-medium text-sm">{product.productName}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">₹{product.netPrice}</span>
            {product.mrp !== product.netPrice && (
              <span className="text-xs text-gray-500 line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>
          <div className="text-sm border rounded-md px-2 py-1">
            {product.productVariants[0].variant || 1}{" "}
            {product.productVariants[0].unit}
          </div>
        </div>
      </div>
    </div>
  );
}
