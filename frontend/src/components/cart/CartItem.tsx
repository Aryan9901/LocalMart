import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: {
    product: Product;
    quantity: number;
  };
}

export function CartItem({ item }: CartItemProps) {
  const { addToCart, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 py-4 border-b">
      <img
        src={product.image}
        alt={product.name}
        className="h-24 w-24 object-cover rounded-md"
      />
      <div className="flex-1 space-y-1">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-muted-foreground">
          ₹{product.price} per {product.unit}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => removeFromCart(product.id)}
          >
            {quantity === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => addToCart(product)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">₹{product.price * quantity}</p>
      </div>
    </div>
  );
}