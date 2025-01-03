import React from "react";
import { Link } from "react-router-dom";
import {
  UserCircle,
  ClipboardList,
  Package,
  LogOut,
  User,
  HistoryIcon,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
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
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Logo" className="w-20" />
          <h1 className="font-medium text-base text-black">
            {JSON.parse(localStorage.getItem("user")).name}
          </h1>
        </div>
        {localStorage.getItem("userRole") === "vendor" ? (
          <VendorMenu />
        ) : (
          <>
            <UserMenu />
          </>
        )}
      </div>
    </header>
  );
}

const VendorMenu = () => {
  const { logout } = useAuth();

  return (
    <Link to="/vendor/profile" className="ml-auto mr-2">
      <UserCircle className="h-7 w-7 " />
    </Link>
  );
};

const UserMenu = () => {
  const { logout } = useAuth();

  return (
    <Link to="/profile" className="ml-auto mr-2">
      <UserCircle className="h-7 w-7 " />
    </Link>
  );
};
