import { History, ShoppingCart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function Header({ cart }) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center ">
        <Link to="/">
          <div className="flex items-center gap-2">
            <img src="/images/logo.jpg" alt="Logo" className="h-8 w-8" />
            <h1 className="font-bold text-lg text-[#39c55e]">Minity</h1>
          </div>
        </Link>
        <Link to="/history" className="ml-auto mr-5">
          <button
            variant="outline"
            className="relative border-[#000] text-[#000]"
          >
            <History className="h-6 w-6" />
          </button>
        </Link>
        <Link to="/cart">
          <button
            variant="outline"
            className="relative border-[#39c55e] text-[#39c55e]"
          >
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#39c55e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </Link>
      </div>
    </header>
  );
}
