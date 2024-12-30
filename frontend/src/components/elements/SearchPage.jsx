import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products } from "../../assets/products";
import { ProductCard } from "./ProductCard";
import { ProductDrawer } from "./ProductDrawer";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const allProducts = [
    ...products.vegetables,
    ...products.fruits,
    ...products.dairy,
  ];

  useEffect(() => {
    if (searchTerm) {
      const results = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      // Remove duplicates by using Set and map
      const uniqueResults = Array.from(new Set(results.map((r) => r.id))).map(
        (id) => results.find((r) => r.id === id)
      );
      setSearchResults(uniqueResults);
    } else {
      setSearchResults(allProducts);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleAddToCart = (
    product,
    quantity = 1,
    weight = product.defaultWeight
  ) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.weight === weight
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.weight === weight
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity, weight }];
    });
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 sm:border-l sm:border-r">
      <div className="max-w-sm mx-auto">
        <header className="flex items-center gap-4 bg-white border-b px-4 py-3">
          <button
            className="p-1"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <form onSubmit={handleSearch} className="flex-1 flex items-center">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              autoFocus
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 focus-visible:ring-offset-0 focus-visible:ring-1"
            />
            <Button type="submit" variant="ghost" size="icon" className="ml-2">
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </header>

        <main className="container mx-auto px-2 py-3">
          <div className="grid grid-cols-2 gap-2">
            {searchResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={() => handleProductSelect(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
          {searchTerm && searchResults.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-gray-500">No products found</p>
              <p className="text-sm text-gray-400 mt-2">
                Try searching for a different product
              </p>
            </div>
          )}
        </main>

        {cart.length > 0 && (
          <div className="fixed max-w-sm mx-auto bottom-4 left-4 right-4">
            <Button
              className="w-full bg-[#39c55e] hover:bg-[#2ea34d] text-white"
              onClick={() => navigate("/cart")}
            >
              {cart.length} {cart.length === 1 ? "item" : "items"} | Go to Cart
            </Button>
          </div>
        )}

        <ProductDrawer
          product={selectedProduct}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedProduct(null);
          }}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
