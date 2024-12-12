import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 object-cover"
        />
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.nameHindi}</p>
            </div>
            {product.discount && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">₹{product.price}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              <p className="text-sm text-muted-foreground">
                per {product.unit}
              </p>
            </div>

            {quantity === 0 ? (
              <Button
                size="sm"
                onClick={() => addToCart(product)}
                className="w-20"
              >
                Add
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => removeFromCart(product.id)}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => addToCart(product)}
                >
                  +
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}