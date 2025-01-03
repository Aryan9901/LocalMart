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
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

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
  const [address, setAddress] = useState({});
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

  const fetchAddress = async (type, id) => {
    try {
      if (type === "vendor") {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/rest/subziwale/api/v1/address`,
          {
            headers: {
              "X-Vendor-Id": id,
            },
          }
        );
        console.log(data);
        setAddress(data[0]);
      } else {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/rest/subziwale/api/v1/address`,
          {
            headers: {
              "X-User-Id": id,
            },
          }
        );
        console.log(data);
        setAddress(data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userType = user.userType;
    const id = user.id;
    console.log(userType, id);

    fetchAddress(userType, id);
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
        <div className="container mx-auto px-4 py-4 flex items-center">
          <ChevronLeft
            onClick={() => navigate(-1)}
            className="h-5 cursor-pointer w-5"
          />
          <h1 className="ml-2 text-xl font-semibold">Profile</h1>
          <User
            onClick={() => navigate("/")}
            className="h-6 w-6 cursor-pointer ml-auto"
          />
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
              <AddressEditForm
                address={address}
                onCancel={() => setIsEditing(false)}
                onSuccess={(updatedAddress) => {
                  setAddress(updatedAddress);
                  setIsEditing(false);
                }}
              />
            ) : (
              <ProfileView
                address={address}
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
            <NavItem
              onClick={() => {
                window.open(`tel:+919899784200}`);
              }}
              icon={Phone}
              tooltip="Support"
            />
          </nav>
        </TooltipProvider>
      )}
    </div>
  );
}

function ProfileView({ userData, address, setIsEditing, handleLogout }) {
  const addressFields = [
    { key: "addressLineOne", label: "House No / Flat / Floor / Building" },
    { key: "addressLineTwo", label: "Locality / Area / Sector" },
    { key: "city", label: "City" },
    { key: "pinCode", label: "Pin Code" },
    { key: "district", label: "District" },
    { key: "state", label: "State/UT" },
    { key: "country", label: "Country" },
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
            <p className="text-base">
              {address && address[key] ? address[key] : "Not provided"}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Update Address
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

function NavItem({ href, icon: Icon, tooltip, onClick }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={href} onClick={onClick} className="p-2">
          <Icon className="h-6 w-6 text-gray-500" />
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function AddressEditForm({ address, onCancel, onSuccess }) {
  const [formData, setFormData] = useState(address);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/rest/subziwale/api/v1/address/${
          address.id
        }`,
        formData,
        {
          headers: {
            [user.userType === "vendor" ? "X-Vendor-Id" : "X-User-Id"]: user.id,
          },
        }
      );
      toast({
        title: "Address Updated",
        description: "Your address has been successfully updated.",
      });
      onSuccess(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addressFields = [
    { key: "addressLineOne", label: "Address Line 1" },
    { key: "addressLineTwo", label: "Address Line 2" },
    { key: "city", label: "City" },
    { key: "pinCode", label: "Pin Code" },
    { key: "district", label: "District" },
    { key: "state", label: "State" },
    { key: "country", label: "Country" },
    { key: "contactNo", label: "Contact No" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          Update Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
