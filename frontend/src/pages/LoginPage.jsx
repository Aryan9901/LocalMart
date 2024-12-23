import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

<style jsx global>{`
  .react-tel-input .country-list {
    max-height: 60px;
    overflow-y: auto;
    margin-top: 0;
  }
`}</style>;

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { sendOTP } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone && phone.replace("91", "").length === 10) {
      let isOtpSent = sendOTP(phone);
      toast.success("✅ Otp Sent!");
      if (isOtpSent) {
        navigate("/verify-otp");
      }
    } else {
      toast.error("‼️ Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#d8eced] to-white">
      <Card className="w-full border-none shadow-none min-h-screen rounded-none p-0 overflow-hidden">
        <div className="grid min-h-screen items-stretch">
          {/* Left side / Mobile top */}
          <div className="relative px-6 py-3 flex items-center justify-center bg-[#F8FFF8] transition-all duration-300 ease-in-out">
            <div className="w-full max-w-md mx-auto space-y-0">
              <h2 className="text-center text-xl font-bold">Login</h2>
              <div className="relative aspect-square w-full max-w-[150px] mx-auto">
                <img
                  src="/images/loginimg.png"
                  alt="Fruits and Vegetables Illustration"
                  className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
                />
              </div>
              <p className="text-center mx-auto w-3/4 leading-5 text-base font-medium text-[#3e803a]">
                High Quality & Fresh Fruits, Vegetables & Dairy Products
              </p>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="py-4 px-5 flex bg-white md:bg-[#d8eced] flex-col justify-center transition-all duration-300 ease-in-out">
            <div className="space-y-3 max-w-md mx-auto w-full">
              <div className="text-center md:text-left space-y-2">
                <h1 className="text-3xl font-bold text-[#3e803a]">
                  Welcome to SabjiWale
                </h1>
                <p className="text-lg text-gray-600">
                  Your go-to app for all groceries
                </p>
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
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#4461F2] hover:bg-[#4461F2]/90 text-white font-medium text-lg transition-all duration-300 ease-in-out focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  Send Mobile OTP
                </Button>

                <p className="text-sm text-center text-gray-600">
                  By proceeding, I accept the
                  <a
                    href="#"
                    className="text-[#4461F2] hover:underline font-medium"
                  >
                    Terms & Conditions
                  </a>
                  and
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
