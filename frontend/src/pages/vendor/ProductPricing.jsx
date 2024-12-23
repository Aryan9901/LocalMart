import { useState, useEffect } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const initialProducts = [
  {
    id: 1,
    name: "Potato",
    localName: "Aloo",
    price: 30,
    mrp: 35,
    netPrice: 28,
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
    mrp: 50,
    netPrice: 42,
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
    mrp: 65,
    netPrice: 57,
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
    mrp: 200,
    netPrice: 170,
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
    mrp: 70,
    netPrice: 55,
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
    mrp: 65,
    netPrice: 58,
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

  useEffect(() => {
    console.log("Initial product prices:");
    initialProducts.forEach((product) => {
      console.log(
        `${product.name}: MRP - ₹${product.mrp}, Net Price - ₹${product.netPrice}`
      );
    });
  }, []);

  const updatePrice = (id, field, newValue) => {
    const numericValue = newValue.replace(/[^0-9]/g, "");
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            [field]: numericValue === "" ? "" : Number(numericValue),
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
      <header className="flex h-14 items-center gap-4 bg-white border-b px-4 sticky top-0 z-10">
        <button
          className="p-1"
          aria-label="Go back"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold">Pricing & Availability</h1>
      </header>

      {/* Product List */}
      <div className="flex-1 overflow-auto">
        {/* Field Headers */}
        <div className="sticky top-0 bg-white border-b px-4 py-2 flex items-center justify-between text-sm font-medium text-gray-600">
          <div className="w-1/3">Product</div>
          <div className="flex items-center justify-end w-2/3">
            <div className="w-14 text-center">MRP</div>
            <div className="w-14 text-center ml-1">Net</div>
            <div className="w-12 text-center">Unit</div>
            <div className="w-8 text-center">Avail</div>
          </div>
        </div>

        <ul className="px-2 py-2 gap-3">
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className="flex items-center my-2 w-full pr-2 rounded-md border-b bg-white border-gray-200"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-14 w-14 rounded-md object-cover mr-3"
              />
              <div className="flex flex-1 items-center justify-between">
                <div className="w-1/3">
                  <h2 className="text-sm flex flex-col items-start">
                    {product.name}
                    {product.localName && (
                      <span className="text-gray-500">
                        ({product.localName})
                      </span>
                    )}
                  </h2>
                </div>
                <div className="flex items-center justify-end w-2/3">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="MRP"
                    value={product.mrp === "" ? "" : product.mrp}
                    onChange={(e) =>
                      updatePrice(product.id, "mrp", e.target.value)
                    }
                    className="h-6 w-14 text-sm border-b border-gray-300 focus:outline-none text-right"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Net"
                    value={product.netPrice === "" ? "" : product.netPrice}
                    onChange={(e) =>
                      updatePrice(product.id, "netPrice", e.target.value)
                    }
                    className="h-6 w-14 text-sm border-b border-gray-300 focus:outline-none text-right ml-1"
                  />
                  <span className="text-sm text-gray-500 w-12 text-center">
                    {product.unit}
                  </span>
                  <button
                    onClick={() => toggleAvailability(product.id)}
                    className="w-8 flex justify-center"
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
      </div>

      {/* Bottom Navigation */}
      <nav className="flex border-t bg-white sticky bottom-0 z-10">
        <button
          className={`flex flex-1 border-t flex-col items-center gap-1 px-3 py-2 ${
            selectedCategory === "vegetables"
              ? "text-black border-[#39c55e]"
              : "text-gray-500 opacity-85"
          }`}
          onClick={() => setSelectedCategory("vegetables")}
        >
          <img
            src="/images/vegetables.png"
            alt="Vegetables"
            className="h-6 w-6"
          />
          <span className="text-xs">Vegetables</span>
        </button>
        <button
          className={`flex flex-1 flex-col border-t items-center gap-1 px-3 py-2 ${
            selectedCategory === "fruits"
              ? "text-black border-[#39c55e]"
              : "text-gray-500 opacity-85"
          }`}
          onClick={() => setSelectedCategory("fruits")}
        >
          <img src="/images/fruits.png" alt="Fruits" className="h-6 w-6" />
          <span className="text-xs">Fruits</span>
        </button>
        <button
          className={`flex flex-1 flex-col border-t items-center gap-1 px-3 py-2 ${
            selectedCategory === "dairy"
              ? "text-black border-[#39c55e]"
              : "text-gray-500 opacity-85"
          }`}
          onClick={() => setSelectedCategory("dairy")}
        >
          <img src="/images/dairy.png" alt="Dairy" className="h-6 w-6" />
          <span className="text-xs">Dairy</span>
        </button>
      </nav>
    </div>
  );
}
