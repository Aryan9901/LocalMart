import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  X,
  ShoppingBag,
  Store,
  Package,
  Phone,
  UserCircle,
  StoreIcon,
  LogOut,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAuth } from "../../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Added state for dialog
  const navigate = useNavigate();

  const handleNavigation = (to) => {
    setShowConfirmDialog(true);
  };

  const renderNavItem = (to, icon, label) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={() => handleNavigation(to)} className="p-2">
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );

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

  const saveChanges = () => {
    // Implement your save logic here
    console.log("Saving changes...", products);
  };

  return (
    <div className="flex sm:border-l sm:border-r h-screen flex-col bg-[#f5f5f5]">
      {/* Header */}
      <header className="flex h-16 items-center gap-4 bg-white border-b px-4 sticky top-0 z-10">
        <button
          className="p-1"
          aria-label="Go back"
          onClick={() => {
            setShowConfirmDialog(true); // Show dialog before navigating
          }}
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold">Pricing & Availability</h1>
        <VendorMenu />
      </header>

      {/* Category Selection */}
      <div className="px-2 py-1 sticky top-14 bg-[#f5f5f5] z-10 shadow-sm">
        <Tabs
          defaultValue="vegetables"
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="w-full bg-white rounded-lg px-1 py-1 gap-2 shadow-none">
            <TabsTrigger
              value="vegetables"
              className="flex-1 data-[state=active]:bg-[#39c55e] data-[state=active]:text-white rounded-md transition-all duration-200"
            >
              <img
                src="/images/vegetables.png"
                alt=""
                className="w-5 h-5 mr-2 inline-block"
              />
              <span>Vegetables</span>
            </TabsTrigger>
            <TabsTrigger
              value="fruits"
              className="flex-1 data-[state=active]:bg-[#39c55e] data-[state=active]:text-white rounded-md transition-all duration-200"
            >
              <img
                src="/images/fruits.png"
                alt=""
                className="w-5 h-5 mr-2 inline-block"
              />
              <span>Fruits</span>
            </TabsTrigger>
            <TabsTrigger
              value="dairy"
              className="flex-1 data-[state=active]:bg-[#39c55e] data-[state=active]:text-white rounded-md transition-all duration-200"
            >
              <img
                src="/images/dairy.png"
                alt=""
                className="w-5 h-5 mr-2 inline-block"
              />
              <span>Dairy</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-auto">
        {/* Field Headers */}
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-600">
          <div className="w-1/3">Product</div>
          <div className="flex items-center justify-end w-2/3">
            <div className="w-14 text-right">MRP</div>
            <div className="w-14 text-right ml-1">Net</div>
            <div className="w-12 text-center">Unit</div>
            <div className="w-8 text-center">Stock</div>
          </div>
        </div>

        <ul className="px-2 pt-0 pb-20 gap-3">
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
        <button className="px-4 py-2 bg-green-500 block mx-auto text-white rounded-md">
          Save Chnages
        </button>
      </div>

      <TooltipProvider>
        <nav className="w-full fixed bottom-0 max-w-sm mx-auto py-2 px-4 flex items-center justify-around bg-white rounded-t-xl shadow-lg border-t z-20">
          {renderNavItem(
            "/vendor",
            <ShoppingBag className="h-6 w-6 text-gray-500" />,
            "My Orders"
          )}
          {renderNavItem(
            "/vendor/store",
            <Store className="h-6 w-6 text-gray-500" />,
            "My Store"
          )}
          {renderNavItem(
            "/vendor/product/pricing",
            <Package className="h-6 w-6 text-black" />,
            "My Products"
          )}
          {renderNavItem(
            "/support",
            <Phone className="h-6 w-6 text-gray-600 cursor-pointer" />,
            "Support"
          )}
        </nav>
      </TooltipProvider>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
          </DialogHeader>
          <p>You have unsaved changes. Do you want to save before leaving?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                navigate(-1);
              }}
            >
              Leave without saving
            </Button>
            <Button
              onClick={() => {
                saveChanges();
                setShowConfirmDialog(false);
                navigate(-1);
              }}
            >
              Save and leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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
