"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { sendOTP } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone) {
      let isOtpSent = sendOTP(phone);
      if (isOtpSent) {
        navigate("/verify-otp");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#d8eced] to-white">
      <Card className="w-full border-none shadow-none min-h-screen rounded-none p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-screen items-stretch">
          {/* Left side / Mobile top */}
          <div className="relative px-6 py-3 md:py-12 flex items-center justify-center bg-[#F8FFF8] transition-all duration-300 ease-in-out">
            <div className="w-full max-w-md mx-auto space-y-1">
              <div className="relative aspect-square w-full max-w-[250px] mx-auto">
                <img
                  src="/images/loginimg.png"
                  alt="Fruits and Vegetables Illustration"
                  className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
                />
              </div>
              <p className="text-center mx-auto w-3/4 text-lg font-medium text-[#3e803a]">
                High Quality & Fresh Fruits & Vegetables
              </p>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="p-6 md:p-12 flex bg-white md:bg-[#d8eced] flex-col justify-center transition-all duration-300 ease-in-out">
            <div className="space-y-8 max-w-md mx-auto w-full">
              <div className="text-center md:text-left space-y-2">
                <h1 className="text-3xl font-bold text-[#3e803a]">
                  Welcome to Minity
                </h1>
                <p className="text-lg text-gray-600">
                  Your go-to app for all groceries
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    disabled
                    value="+91"
                    className="w-16 text-center bg-gray-50 font-medium"
                  />
                  <Input
                    type="tel"
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className="flex-1 focus-visible:ring-offset-0 focus-visible:ring-1"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#4461F2] hover:bg-[#4461F2]/90 text-white font-medium text-lg transition-all duration-300 ease-in-out"
                >
                  Send Mobile OTP
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
