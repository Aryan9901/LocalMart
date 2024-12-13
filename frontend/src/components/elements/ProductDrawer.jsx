import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function ProductDrawer({ product, isOpen, onClose, onAddToCart }) {
  const [selectedWeights, setSelectedWeights] = useState({});
  const [quantities, setQuantities] = useState({});

  const handleWeightToggle = (weight) => {
    setSelectedWeights((prev) => ({
      ...prev,
      [weight]: !prev[weight],
    }));
    if (!quantities[weight]) {
      setQuantities((prev) => ({
        ...prev,
        [weight]: 1,
      }));
    }
  };

  const handleQuantityChange = (weight, change) => {
    const newQuantity = (quantities[weight] || 1) + change;
    if (newQuantity >= 1) {
      setQuantities((prev) => ({
        ...prev,
        [weight]: newQuantity,
      }));
    }
  };

  const calculateTotalPrice = () => {
    return Object.entries(selectedWeights).reduce(
      (total, [weight, isSelected]) => {
        if (isSelected) {
          return total + product.price * (quantities[weight] || 1);
        }
        return total;
      },
      0
    );
  };

  const handleAddToCart = () => {
    const selectedItems = Object.entries(selectedWeights)
      .filter(([weight, isSelected]) => isSelected)
      .map(([weight]) => ({
        ...product,
        selectedWeight: weight,
        quantity: quantities[weight] || 1,
        totalPrice: product.price * (quantities[weight] || 1),
      }));

    onAddToCart(selectedItems);
    onClose();
  };

  if (!product) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[80vh] container max-w-sm mx-auto px-0"
      >
        <SheetHeader className="px-4">
          <SheetTitle>{product.name}</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6 px-4 overflow-y-auto h-[calc(80vh-180px)]">
          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
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
                  <Checkbox
                    id={`weight-${index}`}
                    checked={selectedWeights[weight] || false}
                    onCheckedChange={() => handleWeightToggle(weight)}
                    className="focus-visible:ring-offset-0 focus-visible:ring-1 "
                  />
                  <label
                    htmlFor={`weight-${index}`}
                    className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-32"
                  >
                    {weight}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(weight, -1)}
                    disabled={
                      !selectedWeights[weight] || quantities[weight] <= 1
                    }
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">
                    {quantities[weight] || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(weight, 1)}
                    disabled={!selectedWeights[weight]}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Total:</span>
            <span className="font-bold text-lg">₹{calculateTotalPrice()}</span>
          </div>
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={Object.values(selectedWeights).every((v) => !v)}
          >
            Add to Cart
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
