import { OrderItem } from '@/types';

interface OrderItemListProps {
  items: OrderItem[];
}

export function OrderItemList({ items }: OrderItemListProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.product.id} className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="h-10 w-10 rounded object-cover"
            />
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.quantity} × ₹{item.product.price}
              </p>
            </div>
          </div>
          <p className="font-medium">₹{item.total}</p>
        </div>
      ))}
    </div>
  );
}