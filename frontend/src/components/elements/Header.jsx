import React from "react";
import { Link } from "react-router-dom";
import {
  History,
  ShoppingCart,
  UserCircle,
  ClipboardList,
  Package,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header({ cart }) {
  const { userRole } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center gap-2">
          <img src="/images/logo.jpg" alt="Logo" className="h-8 w-8" />
          <h1 className="font-bold text-lg text-black">SabjiWale</h1>
        </div>
        {userRole === "vendor" ? (
          <VendorMenu />
        ) : (
          <>
            <Link to="/history" className="ml-auto mr-5">
              <Button
                variant="outline"
                size="icon"
                className="relative border-[#000] text-[#000]"
              >
                <History className="h-6 w-6" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button
                variant="outline"
                size="icon"
                className="relative border-[#39c55e] text-[#39c55e]"
              >
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#39c55e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

const VendorMenu = () => {
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserCircle className="h-7 w-7 ml-auto cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/vendor" className="flex items-center">
            <ClipboardList className="mr-2 h-4 w-4" />
            <span>View Orders</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/vendor/product/pricing" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            <span>Manage Products</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
