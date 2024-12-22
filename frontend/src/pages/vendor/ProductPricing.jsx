import { useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

const initialProducts = [
  {
    id: 1,
    name: "Potato",
    localName: "Aloo",
    price: 30,
    unit: "kg",
    image: "/images/patato.png",
    available: true,
    category: "vegetables",
  },
  {
    id: 2,
    name: "Tomato",
    localName: "Tamatar",
    price: 45,
    unit: "kg",
    image: "/images/onion.png",
    available: true,
    category: "vegetables",
  },
  {
    id: 3,
    name: "Mushroom",
    localName: "",
    price: 60,
    unit: "pack",
    image: "/images/tamato.png",
    available: false,
    category: "vegetables",
  },
  {
    id: 4,
    name: "Apple",
    localName: "Seb",
    price: 180,
    unit: "kg",
    image: "/images/redchilli.png",
    available: true,
    category: "fruits",
  },
  {
    id: 5,
    name: "Banana",
    localName: "Kela",
    price: 60,
    unit: "dozen",
    image: "/images/tamato.png",
    available: true,
    category: "fruits",
  },
  {
    id: 6,
    name: "Milk",
    localName: "Doodh",
    price: 60,
    unit: "litre",
    image: "/images/redchilli.png",
    available: true,
    category: "dairy",
  },
];

export default function PricingAvailability() {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("vegetables");
  const navigate = useNavigate();

  const updatePrice = (id, newPrice) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            price: Number(newPrice) || product.price,
          };
        }
        return product;
      })
    );
  };

  const toggleAvailability = (id) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            available: !product.available,
          };
        }
        return product;
      })
    );
  };

  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  return (
    <div className="flex sm:border-l sm:border-r h-screen flex-col bg-[#f5f5f5]">
      {/* Header */}
      <header className="flex h-14 items-center gap-4 bg-white border-b px-4">
        <button
          className="p-1"
          aria-label="Go back"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-lg">Pricing & Availability</h1>
      </header>

      {/* Product List */}
      <main className="flex-1 overflow-auto">
        <ul className="flex flex-col gap-2 py-3 px-2">
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className="flex bg-white shadow-sm rounded-md items-center gap-3  p-0 pr-2"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-14 w-14 rounded-md object-cover"
              />
              <div className="flex flex-1 w-fit  items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm flex flex-col  items-start">
                    {product.name}
                    {product.localName && (
                      <span className="text-gray-500">
                        ({product.localName})
                      </span>
                    )}
                  </h2>
                </div>
                <div className="flex  items-center gap-1">
                  <span className="text-sm">₹</span>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => updatePrice(product.id, e.target.value)}
                    className="h-7 w-14 text-lg border-b-[1.5px] border-black focus:outline-none"
                  />
                  <span className="text-sm text-gray-500">/{product.unit}</span>
                  <button
                    onClick={() => toggleAvailability(product.id)}
                    className="ml-2"
                  >
                    {product.available ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex border-t bg-white">
        <button
          className={`flex flex-1 border-t flex-col items-center gap-1 px-3 py-2 ${
            selectedCategory === "vegetables"
              ? "text-black  border-[#39c55e]"
              : "text-gray-500 opacity-85"
          }`}
          onClick={() => setSelectedCategory("vegetables")}
        >
          <img src="/images/vegetables.png" alt="hello" className="h-6 w-6" />
          <span className="text-xs">Vegetables</span>
        </button>
        <button
          className={`flex flex-1 flex-col border-t items-center gap-1 px-3 py-2 ${
            selectedCategory === "fruits"
              ? "text-black  border-[#39c55e]"
              : "text-gray-500 opacity-85"
          }`}
          onClick={() => setSelectedCategory("fruits")}
        >
          <img src="/images/fruits.png" alt="hello" className="h-6 w-6" />
          <span className="text-xs">Fruits</span>
        </button>
        <button
          className={`flex flex-1 flex-col border-t   items-center gap-1 px-3 py-2 ${
            selectedCategory === "dairy"
              ? "text-black  border-[#39c55e]"
              : "text-gray-500 opacity-85"
          }`}
          onClick={() => setSelectedCategory("dairy")}
        >
          <img src="/images/dairy.png" alt="fg" className="h-6 w-6" />
          <span className="text-xs">Dairy</span>
        </button>
      </nav>
    </div>
  );
}
