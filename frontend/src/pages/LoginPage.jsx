import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone && phone.replace("91", "").length === 10) {
      const userRole = await login(phone);
      if (userRole) {
        if (userRole === "vendor") {
          navigate("/vendor");
        } else {
          navigate("/");
        }
      }
    } else {
      toast.error("Invalid phone number!");
    }
  };

  return (
    <div className="min-h-screen w-full sm:border-l sm:border-r bg-gradient-to-b from-[#d8eced] to-white">
      <Card className="w-full border-none shadow-none min-h-screen rounded-none p-0 overflow-hidden">
        <div className="grid min-h-screen items-stretch">
          {/* Left side / Mobile top */}
          <div
            className={`relative px-6 py-3 flex items-center justify-center  transition-all duration-300 ease-in-out`}
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(images/background.png)",
            }}
          >
            <div className="w-full max-w-md mx-auto space-y-2">
              <div className="relative  w-full max-w-[190px] mx-auto">
                <img
                  src="/images/logo.png"
                  alt="Fruits and Vegetables Illustration"
                  className="w-full  object-contain transition-transform duration-300 ease-in-out"
                />
              </div>
              <p className="text-center mx-auto  w-3/4 leading-5 text-base  text-[#3d6b2f] font-bold">
                High Quality Fresh Fruits, Vegetables & Dairy Products
              </p>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className=" my-0 pt-5  pb-2 px-5 flex bg-white flex-col justify-start transition-all duration-300 ease-in-out">
            <div className="space-y-3 max-w-md mx-auto w-full">
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold text-[#3e803a]">
                  Welcome to Subziwale
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-2 w-full">
                  <PhoneInput
                    country={"in"}
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    inputClass="w-full !h-12 !text-base !font-normal"
                    containerClass="w-full relative"
                    buttonClass="!h-12"
                    dropdownClass="text-base bottom-full absolute w-full max-h-[100px] overflow-y-auto  z-50"
                    onEnterKeyPress={handleSubmit}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#3d6b2f] hover:bg-[#3d6b2f]/90 text-white font-medium text-lg transition-all duration-300 ease-in-out focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  Log In
                </Button>

                <p className="text-sm text-center text-gray-600">
                  By proceeding, I accept the{" "}
                  <a
                    href="#"
                    className="text-[#4461F2] hover:underline font-medium"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-[#4461F2] hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
