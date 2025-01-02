import React from "react";
import { Button } from "@/components/ui/button";

export function ProductCard({ product, onSelect, onAddToCart }) {
  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product, 1, product.productVariants[0]);
  };

  const discount = (
    ((product.mrp - product.netPrice) / product.mrp) *
    100
  ).toFixed(0);

  return (
    <div
      className={`bg-white  rounded-lg overflow-hidden border relative ${
        product?.available ? "cursor-pointer" : "opacity-65 cursor-not-allowed"
      }`}
      onClick={() => {
        if (product?.available) {
          onSelect(product);
        }
      }}
    >
      {!product?.available && (
        <h2 className="absolute text-black font-bold z-50 top-1/2 text-center w-full -translate-y-1/2  text-balance text-base ">
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
          <Button
            variant="secondary"
            size="sm"
            className="absolute -bottom-3 right-2"
            onClick={handleAddToCart}
            disabled={!product?.available}
          >
            Add
          </Button>
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
