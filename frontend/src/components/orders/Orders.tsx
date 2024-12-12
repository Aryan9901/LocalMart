import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { OrderCard } from './OrderCard';
import { OrdersSkeleton } from './OrdersSkeleton';

export function Orders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.orders.list();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <OrdersSkeleton />;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <h2 className="text-xl font-semibold">No orders yet</h2>
        <p className="text-muted-foreground">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}