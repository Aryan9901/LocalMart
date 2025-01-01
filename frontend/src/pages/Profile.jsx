import { useState, useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const getUserData = () => {
  const storedData = localStorage.getItem("user");
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      return {
        id: parsedData.id,
        name: parsedData.name,
        emailId: parsedData.emailId,
        contactNo: parsedData.contactNo,
        userType: parsedData.userType,
        house: "",
        area: "",
        pincode: "",
        district: "",
        state: "",
      };
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }
  return {
    id: "",
    name: "",
    emailId: "",
    contactNo: "",
    userType: "",
    house: "",
    area: "",
    pincode: "",
    district: "",
    state: "",
  };
};

export default function Profile() {
  const [userData, setUserData] = useState(getUserData());
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("userAttachment");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserData((prevData) => ({
          ...prevData,
          ...parsedData,
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  function onSubmit(values) {
    setUserData(values);
    localStorage.setItem("userAttachment", JSON.stringify(values));
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  }

  function handleLogout() {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    logout();
    navigate("/login");
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

      {userData.userType === "vendor" && (
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
      {userData.userType === "user" && (
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

function ProfileView({ userData, setIsEditing, handleLogout }) {
  const addressFields = [
    { key: "house", label: "House No / Flat / Floor / Building" },
    { key: "area", label: "Locality / Area / Sector" },
    { key: "pincode", label: "Pin Code" },
    { key: "district", label: "District" },
    { key: "state", label: "State/UT" },
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p className="text-base">{userData.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-base">{userData.emailId}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Contact No</p>
          <p className="text-base">{userData.contactNo}</p>
        </div>
        {addressFields.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-base">{userData[key] || "Not provided"}</p>
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

  const addressFields = [
    { key: "house", label: "House No / Flat / Floor / Building" },
    { key: "area", label: "Locality / Area / Sector" },
    { key: "pincode", label: "Pin Code" },
    { key: "district", label: "District" },
    { key: "state", label: "State/UT" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-1 pl-2 focus:border-blue-500 focus:border"
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="emailId"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="emailId"
          name="emailId"
          value={formData.emailId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-1 pl-2 focus:border-blue-500 focus:border"
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="contactNo"
          className="block text-sm font-medium text-gray-700"
        >
          Contact No
        </label>
        <input
          type="tel"
          id="contactNo"
          name="contactNo"
          value={formData.contactNo}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-1 pl-2 focus:border-blue-500 focus:border"
        />
      </div>
      {addressFields.map(({ key, label }) => (
        <div key={key} className="space-y-1">
          <label
            htmlFor={key}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
          <input
            type="text"
            id={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-1 pl-2 focus:border-blue-500 focus:border"
          />
        </div>
      ))}
      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
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
