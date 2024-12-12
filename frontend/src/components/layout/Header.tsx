import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== '/';
  const showSearch = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center gap-4">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {showSearch ? (
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-8"
                />
              </div>
            </div>
          ) : (
            <h1 className="text-lg font-semibold">
              {location.pathname.substring(1).charAt(0).toUpperCase() + 
               location.pathname.slice(2)}
            </h1>
          )}
        </div>
      </div>
    </header>
  );
}