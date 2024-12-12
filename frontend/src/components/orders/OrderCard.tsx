import { format } from 'date-fns';
import { Order } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { OrderItemList } from './OrderItemList';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const formattedDate = format(new Date(order.orderDate), 'dd MMM, yyyy h:mm a');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Order #{order.id}</p>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <OrderItemList items={order.items} />
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items Total</span>
            <span>₹{order.total}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-green-600">-₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee</span>
            <span>₹{order.platformFees}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>₹{order.deliveryCharges}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>₹{order.total + order.platformFees + order.deliveryCharges - order.discount}</span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <h4 className="font-medium">Delivery Details</h4>
          <p className="text-muted-foreground">{order.customerName}</p>
          <p className="text-muted-foreground">{order.deliveryAddress}</p>
          <p className="text-muted-foreground">{order.customerPhone}</p>
          {order.deliverySlot && (
            <Badge variant="outline">
              Delivery on {format(new Date(order.deliverySlot.date), 'dd MMM')} at {order.deliverySlot.time}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}