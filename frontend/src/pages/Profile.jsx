import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeft,
  User,
  ShoppingBag,
  Store,
  Package,
  Phone,
  History,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const [userData, setUserData] = useState(getUserData());
  const [address, setAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/rest/subziwale/api/v1/address`,
        {
          headers: {
            "X-User-Id": user.id,
          },
        }
      );
      setAddress(data[0] || null);
    } catch (error) {
      console.error("Error fetching address:", error);
      toast.error("Failed to fetch address. Please try again.");
    }
  };

  const handleLogout = () => {
    toast.success("You have been successfully logged out.");
    logout();
    navigate("/login");
  };

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
          <CardContent className="pt-0">
            {isEditing ? (
              <AddressEditForm
                address={address}
                onCancel={() => setIsEditing(false)}
                onSuccess={(updatedAddress) => {
                  setAddress(updatedAddress);
                  setIsEditing(false);
                  fetchAddress();
                }}
              />
            ) : (
              <ProfileView
                userData={userData}
                address={address}
                setIsEditing={setIsEditing}
                handleLogout={handleLogout}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <BottomNavigation userType={userData.userType} />
    </div>
  );
};

const ProfileView = ({ userData, address, setIsEditing, handleLogout }) => {
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
    <div className="space-y-4">
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
        {address &&
          addressFields.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="text-base">{address[key] || "Not provided"}</p>
            </div>
          ))}
        {/* {!address && <div>Address : Not Provided</div>} */}
      </div>
      <div className="flex gap-4">
        <Button onClick={() => setIsEditing(true)} className="flex-1">
          {address ? "Update Address" : "Add Address"}
        </Button>
        <Button onClick={handleLogout} variant="destructive" className="flex-1">
          Logout
        </Button>
      </div>
    </div>
  );
};

const AddressEditForm = ({ address, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState(
    address || {
      addressLineOne: "",
      addressLineTwo: "",
      city: "",
      pinCode: "",
      district: "",
      state: "",
      country: "",
      contactNo: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;
    formData.type = "home";
    console.log(formData);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/rest/subziwale/api/v1/address`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId,
          },
        }
      );
      toast.success(
        address ? "Address updated successfully" : "Address added successfully"
      );
      onSuccess(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update address. Please try again.");
    }
  };

  const addressFields = [
    { key: "addressLineOne", label: "Address Line 1" },
    { key: "addressLineTwo", label: "Address Line 2" },
    { key: "city", label: "City" },
    { key: "district", label: "District" },
    { key: "pinCode", label: "Pin Code" },
    { key: "state", label: "State" },
    { key: "country", label: "Country" },
    { key: "contactNo", label: "Contact No" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {addressFields.map(({ key, label }) => (
        <div key={key} className="space-y-1">
          <Label className="relative" htmlFor={key}>
            {label}
            {key !== "addressLineTwo" && key !== "district" && (
              <span className="absolute -right-2 text-red-500 top-0">*</span>
            )}
          </Label>
          <Input
            type="text"
            id={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            required={key !== "addressLineTwo" && key !== "district"}
            className="focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-green-600"
          />
        </div>
      ))}
      <div className="flex gap-4">
        <Button type="submit" className="flex-1">
          {address ? "Update Address" : "Add Address"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

const BottomNavigation = ({ userType }) => {
  return (
    <TooltipProvider>
      <nav className="w-full fixed bottom-0 max-w-sm mx-auto py-2 px-4 flex items-center justify-around bg-white shadow-lg border-t z-20">
        {userType === "vendor" ? (
          <>
            <NavItem href="/vendor" icon={ShoppingBag} tooltip="My Orders" />
            <NavItem href="/vendor/store" icon={Store} tooltip="My Store" />
            <NavItem
              href="/vendor/product/pricing"
              icon={Package}
              tooltip="My Products"
            />
            <NavItem href="#" icon={Phone} tooltip="Support" />
          </>
        ) : (
          <>
            <NavItem href="/history" icon={History} tooltip="My Orders" />
            <NavItem href="/" icon={Store} tooltip="Store" />
            {/* <NavItem href="/cart" icon={ShoppingCart} tooltip="My Cart" /> */}
            <NavItem
              onClick={() => {
                window.open(`tel:+919899784200`);
              }}
              icon={Phone}
              tooltip="Support"
            />
          </>
        )}
      </nav>
    </TooltipProvider>
  );
};

const NavItem = ({ href, icon: Icon, tooltip, onClick }) => {
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
};

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
  };
};

export default Profile;
