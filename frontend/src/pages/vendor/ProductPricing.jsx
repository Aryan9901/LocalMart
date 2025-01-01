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
  Minus,
  Plus,
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
    // mrp: 35,
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
    // mrp: 50,
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
    // mrp: 65,
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
    // mrp: 200,
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
    // mrp: 70,
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
    // mrp: 65,
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [changedItems, setChangedItems] = useState(new Set());
  const [navigation, setNavigation] = useState("");
  const [newCategory, setNewCategory] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = (to) => {
    if (changedItems.size > 0) {
      // setNewCategory(to);
      setShowConfirmDialog(true);
      setNavigation(to);
    } else {
      navigateTo(to);
    }
  };

  const navigateTo = (to) => {
    if (typeof to === "number") {
      navigate(to);
    } else {
      navigate(to);
    }
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
      console.log(`${product.name}: Net Price - ₹${product.netPrice}`);
    });
  }, []);

  const updatePrice = (id, newValue) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          const updatedProduct = {
            ...product,
            netPrice: newValue,
          };
          if (updatedProduct.netPrice !== product.netPrice) {
            setChangedItems((prev) => new Set(prev).add(id));
          } else {
            setChangedItems((prev) => {
              const newSet = new Set(prev);
              newSet.delete(id);
              return newSet;
            });
          }
          return updatedProduct;
        }
        return product;
      })
    );
  };

  const toggleAvailability = (id) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          const updatedProduct = {
            ...product,
            available: !product.available,
          };
          setChangedItems((prev) => new Set(prev).add(id));
          return updatedProduct;
        }
        return product;
      })
    );
  };

  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  const saveChanges = () => {
    console.log("Saving changes...");
    const changedProducts = products.filter((product) =>
      changedItems.has(product.id)
    );
    console.log("Changed products:", changedProducts);
    setChangedItems(new Set());
    // Here you would typically make an API call to save the changes
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    setShowConfirmDialog(false);
  };

  return (
    <div className="flex sm:border-l sm:border-r h-screen flex-col bg-[#f5f5f5]">
      {/* Header */}
      <header className="flex h-16 items-center gap-4 bg-white border-b px-4 sticky top-0 z-10">
        <button
          className="p-1"
          aria-label="Go back"
          onClick={() => handleNavigation(-1)}
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
          onValueChange={(category) => {
            if (changedItems.size > 0) {
              setNewCategory(category);
              setShowConfirmDialog(true);
            } else {
              setSelectedCategory(category);
            }
          }}
          className="w-full"
        >
          <TabsList className="w-full bg-white rounded-lg px-1 py-1 gap-2 shadow-none">
            <TabsTrigger
              value="vegetables"
              className="flex-1 data-[state=active]:bg-[#39c55e] data-[state=active]:text-white rounded-md transition-all duration-200"
            >
              <img
                src="/Vegetables.png"
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
                src="/Fruits.png"
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
                src="/Dairy.png"
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
          <div className="flex items-center justify-end gap-1 w-2/3">
            <div className="w-20 text-center ml-1">Price</div>
            <div className="w-12 text-center">Unit</div>
            <div className="w-8 text-center">Stock</div>
          </div>
        </div>

        <ul className="px-2 pt-0 pb-20 gap-3">
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className={`flex items-center my-2 w-full pr-2 rounded-md border-b ${
                changedItems.has(product.id) ? "bg-yellow-50" : "bg-white"
              } border-gray-200`}
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
                <div className="flex items-center gap-1 justify-end w-2/3">
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        updatePrice(product.id, product.netPrice - 5)
                      }
                      className="px-1"
                    >
                      <Minus className="h-4 w-4 text-gray-500" />
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Price"
                      value={product.netPrice === "" ? "" : product.netPrice}
                      onChange={(e) =>
                        updatePrice(product.id, Number(e.target.value))
                      }
                      className="h-6 w-14 text-sm border-b border-gray-300 focus:outline-none text-center"
                    />
                    <button
                      onClick={() =>
                        updatePrice(product.id, product.netPrice + 5)
                      }
                      className="px-1"
                    >
                      <Plus className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
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
        {changedItems.size > 0 && (
          <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2">
            <button
              onClick={() => {
                setProducts(initialProducts);
                setChangedItems(new Set());
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-lg"
            >
              Discard Changes
            </button>
            <button
              onClick={saveChanges}
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow-lg"
            >
              Save Changes
            </button>
          </div>
        )}
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
          <p>
            You have unsaved changes. Do you want to save before{" "}
            {newCategory && typeof newCategory === "string"
              ? "changing categories"
              : "leaving"}
            ?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                setProducts(initialProducts);
                setChangedItems(new Set());
                if (navigation) {
                  navigate(navigation);
                } else {
                  if (newCategory) {
                    if (typeof newCategory === "string") {
                      setSelectedCategory(newCategory);
                    } else {
                      navigateTo(newCategory);
                    }
                  }
                  setNewCategory(null);
                }
              }}
            >
              Discard changes
            </Button>
            <Button
              onClick={() => {
                saveChanges();
                setShowConfirmDialog(false);
                if (navigation) {
                  navigate(navigation);
                } else {
                  if (newCategory) {
                    if (typeof newCategory === "string") {
                      setSelectedCategory(newCategory);
                    } else {
                      navigateTo(newCategory);
                    }
                  }
                  setNewCategory(null);
                }
              }}
            >
              Save and continue
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
