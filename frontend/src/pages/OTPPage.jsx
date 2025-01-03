"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const { verifyOTP, phoneNumber } = useAuth();
  const navigate = useNavigate();
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/login");
    }
  }, [phoneNumber, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((digit) => !digit)) {
      setError("Please enter complete OTP");
      return;
    }

    try {
      const success = await verifyOTP(otp.join(""));
      if (success) {
        navigate("/");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.err(err);
      setError("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full sm:border-l sm:border-r bg-gradient-to-b from-[#d8eced] to-white">
      <Card className="w-full border-none shadow-none min-h-screen rounded-none p-0 overflow-hidden">
        <div className="grid min-h-screen items-stretch">
          {/* Left side / Mobile top */}
          <div className="relative px-6 py-1  flex items-center justify-center bg-[#F8FFF8] transition-all duration-300 ease-in-out">
            <div className="w-full max-w-md mx-auto space-y-0">
              <h2 className="text-center text-xl font-bold">Verify Otp</h2>
              <div className="relative aspect-square w-full max-w-[150px] mx-auto">
                <img
                  src="/images/loginimg.png"
                  alt="Fruits and Vegetables Illustration"
                  className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
                />
              </div>
              <p className="text-center mx-auto w-3/4 leading-6 text-base font-medium text-[#3e803a]">
                High Quality & Fresh Fruits, Vegetables & Dairy Products
              </p>
            </div>
          </div>

          {/* Right side - OTP Form */}
          <div className="px-6 py-0  flex bg-white md:bg-[#d8eced] flex-col justify-center transition-all duration-300 ease-in-out">
            <div className="space-y-3 max-w-md mx-auto w-full">
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold text-[#3e803a]">Enter OTP</h1>
                <p className="text-base text-gray-600">
                  OTP sent to: {phoneNumber}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex justify-center gap-4">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      inputMode="numeric"
                      ref={inputRefs[index]}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      autoFocus={index == 0 ? true : false}
                      className="w-12 h-12 text-center text-xl font-medium focus-visible:ring-offset-0 focus-visible:ring-1"
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#4461F2] hover:bg-[#4461F2]/90 text-white font-medium text-lg transition-all focus-visible:ring-offset-0 focus-visible:ring-1 duration-300 ease-in-out"
                >
                  Verify OTP
                </Button>

                <p className="text-sm text-center text-gray-600">
                  {timer > 0 ? (
                    `Resend OTP in ${timer} sec.`
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setError("");
                        setTimer(30);
                      }}
                      className="text-[#4461F2] hover:underline p-0 h-auto font-medium"
                    >
                      Resend OTP
                    </Button>
                  )}
                </p>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
