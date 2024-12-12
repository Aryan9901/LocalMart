import { useCart } from '@/hooks/useCart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CartSummary() {
  const { getTotalAmount } = useCart();
  const subtotal = getTotalAmount();
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}