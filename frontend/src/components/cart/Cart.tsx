import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Cart() {
  const { items, getTotalAmount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground">Add items to get started</p>
        <Button onClick={() => navigate('/')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>
      
      <CartSummary />
      
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t">
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout (₹{getTotalAmount()})
        </Button>
      </div>
    </div>
  );
}