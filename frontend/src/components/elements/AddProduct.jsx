import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/elements/ProductCard";
import { ProductDrawer } from "@/components/elements/ProductDrawer";
import { useCart } from "@/hooks/useCart";
import axios from "axios";
import { VENDOR_ID } from "@/constant/constant";

export default function AddProduct() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      filterProducts();
    }
  }, [searchTerm, allProducts]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const categories = ["Vegetables", "Fruits", "Dairy"];
      const vendorId = VENDOR_ID;
      const productPromises = categories.map((category) =>
        axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/rest/subziwale/api/v1/products?category=${category}`,
          {
            headers: {
              "X-Vendor-Id": vendorId,
            },
          }
        )
      );
      const responses = await Promise.all(productPromises);
      const products = responses.flatMap((response) => response.data);
      setAllProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterProducts();
  };

  const handleAddToCart = (product, quantity, variant) => {
    addToCart({
      id: product.productId,
      name: product.productName,
      image: product.productImageUrl,
      mrp: variant.mrp || product.mrp,
      price: variant.netPrice || product.netPrice,
      quantity: quantity,
      variant: variant,
    });
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 sm:border-l sm:border-r">
      <div className="max-w-sm mx-auto">
        <header className="flex items-center gap-4 bg-white border-b px-4 py-3 sticky top-0 z-10">
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

        <main className="container mx-auto px-4 py-4 mb-20">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-gray-500">No products found</p>
              <p className="text-sm text-gray-400 mt-2">
                Try searching for a different product
              </p>
            </div>
          )}
        </main>

        {localStorage.getItem("userRole") === "user" && cart.length > 0 && (
          <div className="fixed max-w-sm mx-auto bottom-5 left-4 right-4">
            <Button
              className="w-10/12 mx-auto flex bg-[#39c55e] hover:bg-[#2ea34d] text-white shadow-lg transition-all duration-200"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
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
