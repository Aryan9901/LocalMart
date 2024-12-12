import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function ProductDrawer({ product, isOpen, onClose, onAddToCart }) {
  const [selectedWeight, setSelectedWeight] = useState(product?.weights[0]);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const calculatePrice = () => {
    const basePrice = product?.price || 0;
    return basePrice * quantity;
  };

  if (!product) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>{product.name}</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                {product.discount}% OFF
              </div>
            )}
          </div>

          <div className="space-y-4">
            {product.weights.map((weight, index) => (
              <div
                key={weight}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`weight-${index}`}
                    name="weight"
                    value={weight}
                    checked={selectedWeight === weight}
                    onChange={() => setSelectedWeight(weight)}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`weight-${index}`}>{weight}</label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between border rounded-lg p-3">
              <span className="font-medium">Quantity</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Total:</span>
            <span className="font-bold text-lg">₹{calculatePrice()}</span>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              onAddToCart({
                ...product,
                quantity,
                selectedWeight,
                totalPrice: calculatePrice(),
              });
              onClose();
            }}
          >
            Add to Cart
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
