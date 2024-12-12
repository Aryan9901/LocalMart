import { Link, useLocation } from 'react-router-dom';
import { Home, Store, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

export function Navigation() {
  const location = useLocation();
  const { getTotalItems } = useCart();

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/feed', icon: Store, label: 'Feed' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: getTotalItems() },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {links.map(({ to, icon: Icon, label, badge }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-sm',
                location.pathname === to
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {badge ? (
                  <span className="absolute -top-2 -right-2 h-4 w-4 text-[10px] font-medium flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                    {badge}
                  </span>
                ) : null}
              </div>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}