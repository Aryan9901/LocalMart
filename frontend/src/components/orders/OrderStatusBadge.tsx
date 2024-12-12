import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: 'pending' | 'completed' | 'cancelled';
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === 'completed' && 'border-green-500 text-green-500',
        status === 'cancelled' && 'border-red-500 text-red-500',
        status === 'pending' && 'border-yellow-500 text-yellow-500'
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}