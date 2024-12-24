import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingBag,
  Store,
  Package,
  Phone,
  User,
  History,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Mock user data - replace with actual data fetching
const userData = {
  name: "John Doe",
  mobile: "9876543210",
  houseNo: "A-123",
  apartmentName: "Green Valley Apartments",
  plotNo: "45",
  sector: "Sector 15",
  city: "Mumbai",
  state: "Maharashtra",
  pinCode: "400001",
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { logout, userRole } = useAuth();

  function onSubmit(values) {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
    console.log(values);
  }

  function handleLogout() {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    logout();
  }

  return (
    <div className="flex flex-col max-w-sm mx-auto sm:border-l sm:border-r min-h-screen">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Profile</h1>
          <User className="h-6 w-6" />
        </div>
      </header>

      <main className="flex-grow container mx-auto py-1 mb-16 px-2 max-w-sm">
        <Card>
          <CardHeader className="py-3">
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update your personal and address details."
                : "View your profile information below."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 ">
            {isEditing ? (
              <ProfileEditForm
                userData={userData}
                onSubmit={onSubmit}
                setIsEditing={setIsEditing}
              />
            ) : (
              <ProfileView
                userData={userData}
                setIsEditing={setIsEditing}
                handleLogout={handleLogout}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {userRole === "vendor" && (
        <TooltipProvider>
          <nav className="w-full fixed bottom-0 max-w-sm mx-auto py-2 px-4 flex items-center justify-around bg-white rounded-t-xl shadow-lg border-t z-20">
            <NavItem href="/vendor" icon={ShoppingBag} tooltip="My Orders" />
            <NavItem href="/vendor/store" icon={Store} tooltip="My Store" />
            <NavItem
              href="/vendor/product/pricing"
              icon={Package}
              tooltip="My Products"
            />
            <NavItem href="#" icon={Phone} tooltip="Support" />
          </nav>
        </TooltipProvider>
      )}
      {userRole === "user" && (
        <TooltipProvider>
          <nav className="w-full fixed bottom-0 max-w-sm mx-auto py-2 px-4 flex items-center justify-around bg-white rounded-t-xl shadow-lg border-t z-20">
            <NavItem href="/history" icon={History} tooltip="My Orders" />
            <NavItem href="/" icon={Store} tooltip="Store" />
            <NavItem href="/cart" icon={ShoppingCart} tooltip="My Cart" />
            <NavItem href="#" icon={Phone} tooltip="Support" />
          </nav>
        </TooltipProvider>
      )}
    </div>
  );
}

// Profile View Component
function ProfileView({ userData, setIsEditing, handleLogout }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(userData).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <p className="text-sm font-medium text-gray-500">
              {key.charAt(0).toUpperCase() +
                key
                  .slice(1)
                  .replace(/([A-Z])/g, " $1")
                  .trim()}
            </p>
            <p className="text-base">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Update Profile
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// Profile Edit Form Component
function ProfileEditForm({ userData, onSubmit, setIsEditing }) {
  const [formData, setFormData] = useState(userData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.entries(userData).map(([field, value]) => (
        <div key={field} className="space-y-1">
          <label
            htmlFor={field}
            className="block text-sm font-medium text-gray-700"
          >
            {field.charAt(0).toUpperCase() +
              field
                .slice(1)
                .replace(/([A-Z])/g, " $1")
                .trim()}
          </label>
          <input
            type="text"
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-1 pl-2 focus:border"
          />
        </div>
      ))}
      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Navigation Bar Component
function NavItem({ href, icon: Icon, tooltip }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={href} className="p-2">
          <Icon className="h-6 w-6 text-gray-500" />
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
